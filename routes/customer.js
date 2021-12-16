const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/src/classes/backend/');
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

const connectionPoolPath=__dirname.replace('/routes', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();

function bubbleSort(array, clientRequestOrDatabaseResult){
  let reference='', aux=null;
  clientRequestOrDatabaseResult? reference='name' : reference='productname';
  for (let i=0; i<array.length; i++){
    for (let j=0; j<array.length-1; j++){
      if (array[j][reference]>array[j+1][reference]){
        aux=array[j];
        array[j]=array[j+1];
        array[j+1]=aux;
      }
    }
  }
  return array;
}

router.post('/catalogue/buy', async (req, res)=>{
  try{
    /*I check if the quantity of the products is complete. If so, I complete the transaction and update the product quantity in the 
    database. If not, I send a message to the user notifying him that the quantity of the respective products is not enough.*/
    let productsNames='';
    for (let i=0; i<req.body.items.length; i++){
      i!==req.body.items.length-1? productsNames+=`'${req.body.items[i].name}', ` : productsNames+=`'${req.body.items[i].name}'`;
    }
    let [data, metadata]=await sequelize.query(`SELECT productname, availablequantity FROM stocks WHERE productName 
      IN (${productsNames})`);
    /*I order both the array of items and the array returned by the database, in this way, I will be able to compare the quantity ordered by the customer and the current quantity available for each product. As the result returned by the database query is not in the same order as the user's request, so I order them to be able to compare them.
    Also, when you update the available quantity of each item, the order of the update will be correct.*/
    req.body.items=bubbleSort(req.body.items, true);
    data=bubbleSort(data, false);
    let productsWithInsufficientQuantity=[];
    for (let i=0; i<data.length; i++){
      if (data[i].availablequantity<req.body.items[i].amount){
        productsWithInsufficientQuantity.push(req.body.items[i])
      }
    }
    if (productsWithInsufficientQuantity.length>0){
      return res.json({message: 'Producto(s) con cantidad insuficiente', result: productsWithInsufficientQuantity});
    }
    let cases='CASE productname ';
    for (let i=0; i<data.length; i++){
      cases+=`WHEN '${data[i].productname}' THEN ${data[i].availablequantity-req.body.items[i].amount} `;
    }
    let query='UPDATE stocks SET availablequantity='+cases+' ELSE availablequantity END ';
    query+=`WHERE productname IN (${productsNames})`;
    await sequelize.query(query);

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
      deliveryStatus: false,
      /*I assume that the administrator have not seen the event. However, if 
      he are in the transaction view, then an event will be fired that changes the state to true automatically.*/
      viewByAdministrator: false
    });
    /*Apart from the message, I send the dni (req.user), so, the event of the socket will have the complete data for render in the 
    purchase view admin*/
    res.json({message: 'Successfull operation', dni: req.user});
  } catch(err){
    console.log(err)
    res.json({message: 'Failed operation'});
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


router.get('/dni', (req, res)=>{
  res.json({dni: req.user});
});

module.exports=router;