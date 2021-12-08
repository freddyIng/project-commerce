const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const customer=require(classPath+'customer.js');
const admin=require(classPath+'admin.js');
const purchases=require(classPath+'purchase.js');
const stock=require(classPath+'stock.js');
const { body, validationResult }=require('express-validator');
const bcrypt=require('bcrypt');
const saltRounds=10;

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

router.get('/signin', (req, res)=>{
  res.sendFile(viewPath+'/customer/signin.html');
});

router.post('/signin',
  body('dni').isNumeric().isLength({min: 6, max: 8}).trim().escape(),
  body('password').isLength({min: 6, max: 20}).trim().escape()
  , async (req, res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()){
    //return res.status(400).json({ errors: errors.array() });
    let message='Datos invalidos. El numero de cedula debe tener minimo 6 numeros y maximo 8.';
    message+='A su vez, la contraseña debe tener minimo 6 caracteres y maximo 20.';
    return res.send(message);
  }
  bcrypt.hash(req.body.password, saltRounds, async (err, hash)=>{
    if (err) return res.send('Ha ocurrido un error al encriptar tu contraseña. Intentelo de nuevo');
    try{
      await customer.create({
        dni: req.body.dni,
        password: hash, 
      });
      res.send('The has registrado con exito! Ahora puedes iniciar sesion para empezar a usar nuestro servicio.');
    } catch(err){
      res.send('Ha ocurrido un error. Intentelo de nuevo!');
    }
  });
});

router.get('/catalogue', async (req, res)=>{
  res.sendFile(viewPath+'/customer/catalogue.html');
});

router.get('/catalogue/products', async (req, res)=>{
  try{
    let products=await stock.findAll({});
    res.json({result: products});
  } catch(err){
    console.log(err)
    res.json({result: 'Ha ocurrido un error al obtener los productos de este comercio'});
  }
});

router.get('/catalogue/payment-information', async (req, res)=>{
  try{
    let data=await admin.findAll({attributes: ['paymentInformation']});
    res.json({message: 'Sucessfull operation', result: data});
  } catch(err){
    console.log(err)
    res.json({message: 'Failed operation'});
  }
});

const validator=require('validator');

router.post('/catalogue/buy', async (req, res)=>{
  //Remeber that the purchase table. It belongs to both the business and the customer. Both can consult it when viewing their transactions.
  try{
    //I sanitize the transction number because is the only keyboard entry for the client
    req.body.referenceTransactionNumber=validator.trim(req.body.referenceTransactionNumber);
    req.body.referenceTransactionNumber=validator.escape(req.body.referenceTransactionNumber);
    await purchases.create({
      customerDni: req.user, 
      items: req.body.items, 
      totalPrice: req.body.totalPrice,
      paymentMethod: req.body.paymentMethod,
      referenceTransactionNumber: req.body.referenceTransactionNumber,
      verificationStatus: 'Pendiente',
      deliveryStatus: false
    });
    //Apart from update the purchases table, I need update the stock table of the respective commerce
    res.json({result: 'Successfull operation'});
  } catch(err){
    console.log(err)
    res.json({result: 'Failed operation'});
  }
});

router.get('/purchases', (req, res)=>{
  res.sendFile(viewPath+'/customer/purchases.html');
});

router.get('/purchases/data', async (req, res)=>{
  try{
    let data=await purchases.findAll({
      where: {
        customerDni: req.user
      }
    });
    res.json({message: 'Sucessfull operation', result: data});
  } catch(err){
    res.json({message: 'Failed operation'});
  }
});

module.exports=router;