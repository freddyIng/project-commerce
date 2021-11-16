const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const customer=require(classPath+'customer.js');
const commerce=require(classPath+'commerce.js');
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
  body('name').isLength({min: 5, max: 30}).trim().escape(), //min 5 because the short name that I remember is "ana" (max 30 I don't know :p)
  body('lastName').isLength({min: 5, max: 30}).trim().escape(),
  body('dni').isNumeric().isLength({min: 6, max: 8}).trim().escape(),
  body('password').isLength({min: 8, max: 20}).trim().escape(),
  body('email').isEmail().normalizeEmail().trim().escape(),
  body('phoneNumber').isNumeric().trim().escape()
  , async (req, res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  bcrypt.hash(req.body.password, saltRounds, async (err, hash)=>{
    if (err) return res.send('Ha ocurrido un error al encriptar tu contraseña. Intentelo de nuevo');
    try{
      await customer.create({
        name: req.body.name, 
        lastName: req.body.lastName, 
        dni: req.body.dni,
        password: hash, 
        email: req.body.email, 
        phoneNumber: req.body.phoneNumber
      });
      res.send('The has registrado con exito! Ahora puedes iniciar sesion para empezar a usar nuestro servicio.');
    } catch(err){
      res.send('Ha ocurrido un error. Intentelo de nuevo!');
    }
  });
});


router.get('/home-client', (req, res)=>{
  res.sendFile(viewPath+'/home-client.html');
});

router.get('/home-client/shops-state-template', (req, res)=>{
  res.sendFile(viewPath+'/shops-state.html');
});

router.get('/home-client/shops-state-template/data-shops', async (req, res)=>{
  try{
    let shops=await commerce.findAll({
      where: {
        state: req.query.state
      }
    });
    res.json({result: shops});
  } catch(err){
    res.json({result: 'Ha ocurrido un error al obtener los comercios de este estado!'});
  }
});

router.get('/catalogue', async (req, res)=>{
  res.sendFile(viewPath+'/catalogue.html');
});

router.get('/catalogue/products', async (req, res)=>{
  try{
    let products=await stock.findAll({
      where: {
        commerceName: req.query.commerceName
      }
    });
    res.json({result: products});
  } catch(err){
    res.json({result: 'Ha ocurrido un error al obtener los productos de este comercio'});
  }
});

router.get('/catalogue/payment-information', async (req, res)=>{
  try{
    let data=await commerce.findAll({
      attributes: ['paymentInformation'],
      where: {
        commerceName: req.query.commerceName
      }
    })
    res.json({message: 'Sucessfull operation', result: data});
  } catch(err){
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
      commerceName: req.body.commerceName,
      customerDni: req.user, 
      items: req.body.items, 
      totalPrice: req.body.totalPrice,
      paymentMethod: req.body.paymentMethod,
      referenceTransactionNumber: req.body.referenceTransactionNumber
    });
    //Apart from update the purchases table, I need update the stock table of the respective commerce
    res.json({result: 'Successfull operation'});
  } catch(err){
    console.log(err)
    res.json({result: 'Failed operation'});
  }
});

router.get('/purchases', (req, res)=>{
  res.sendFile(viewPath+'/purchases.html');
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