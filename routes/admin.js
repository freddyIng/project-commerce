const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const commerce=require(`${classPath}commerce.js`);
const purchases=require(`${classPath}purchase.js`);
const stock=require(classPath+'stock.js');
const multer=require('multer');
const upload=multer({dest: `commerce-photos/product-photos`});
const { body, validationResult }=require('express-validator');
const bcrypt=require('bcrypt');
const saltRounds=10;
/*Debo hallar la manera de subir la foto a la subcarpeta del negocio
Supongo que podria trasladar la foto desde ese directorio al subdirectorio dle negocio usando fs. Y si no existe el directorio,
quiere decir que el administrador todavia no ha subido ningun producto, y por lo tanto, tendra que crearse por primera vez.*/
const fs=require('fs').promises;

router.get('/', (req, res)=>{
  res.sendFile(viewPath+'/admin-login.html');
});

router.get('/signin', (req, res)=>{
  res.sendFile(viewPath+'/admin-signin.html');
});

async function deleteFile(fileName){
  try{
    await fs.unlink(`./commerce-photos/${filename}`);
    return 'Operacion exitosa!';
  } catch(err){
    return 'Error';
  }
}

router.post('/signin',
  body('commerceName').isLength({min: 3, max: 30}).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').trim().escape(),
  body('password').isLength({min: 8, max: 20}).trim().escape(),
  body('state').trim().escape(),
  body('city').trim().escape(),
  body('direction').trim().escape(), async (req, res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  bcrypt.genSalt(saltRounds, (err, salt)=>{
    if (err) return res.send('Ha ocurrido un error');
    bcrypt.hash(req.body.password, salt, async (err, hash)=>{
    if (err) return res.send('Ha ocurrido un error. Intentelo de nuevo');
      try{
        let newCommerce=await commerce.create({commerceName: req.body.commerceName, email:
          req.body.email, phoneNumber: req.body.phoneNumber, password: hash, state: req.body.state, city: req.body.city,
          direction: req.body.direction});
        res.send('Operacion exitosa');
      } catch(err){
        console.log(err);
        res.send('Ha ocurrido un error. Intentelo de nuevo');
      }
  });
  });
});

router.get('/edit-payment-information', (req, res)=>{
  res.sendFile(viewPath+'/edit-payment-information.html');
});

router.get('/payment-information', async (req, res)=>{
  try{
    let data=await commerce.findAll({
      attributes: ['paymentInformation'],
      where: {
        commerceName: req.user
      }
    })
    res.json({message: 'Sucessfull operation', result: data});
  } catch(err){
    res.json({message: 'Failed operation'});
  }
});

router.put('/edit-payment-information', async (req, res)=>{
  try{
    await commerce.update({paymentInformation: req.body}, {
      where: {
        commerceName: req.user
      }
    });
    res.json({result: 'Sucessfull operation'});
  } catch(err){
    res.json({result: 'Failed operation'});
  }
});

router.get('/inventory', (req, res)=>{
  res.sendFile(viewPath+'/inventory.html');
});

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

router.get('/get-products', async (req, res)=>{
  try{
    let products=await stock.findAll({
      where: {
        commerceName: req.user
      }
    });
    return res.json({result: products});
  } catch(err){
    return res.json({result: 'Ha ocurrido un error.'});
  }
});

const validator=require('validator');

router.post('/add-product', upload.single('productPhoto'), async (req, res)=>{
  req.body.productName=validator.trim(req.body.productName); req.body.productName=validator.escape(req.body.productName);
  req.body.classification=validator.trim(req.body.classification); req.body.classification=validator.escape(req.body.classification);
  req.body.amount=validator.trim(req.body.amount); req.body.amount=validator.escape(req.body.amount);
  req.body.price=validator.trim(req.body.price); req.body.price=validator.escape(req.body.price);
  if (req.file.mimetype==='image/png' || req.file.mimetype==='image/jpeg'){
    try{
      //Antes de agregar el producto a database, muevo imagen al subdirectorio correspondiente del comercio. Si no existe, lo creo
      try{
        await fs.opendir(`commerce-photos/product-photos/${req.user}`);
      } catch(err){
        if (err.code==='ENOENT'){
          await fs.mkdir(`commerce-photos/product-photos/${req.user}`);
        }
      }
      try{
        await fs.rename(`commerce-photos/product-photos/${req.file.filename}`, `commerce-photos/product-photos/${req.user}/${req.file.filename}`);
      } catch(err){
      	console.log(err);
      }
      await stock.create({commerceName: req.user, productName: req.body.productName, classification: req.body.classification, 
      availableQuantity: req.body.amount, price: req.body.price, productPhotoPath: `/product-photos/${req.user}/${req.file.filename}`});
      res.json({result: 'El producto ha sido añadido!'});
    } catch(err){
      res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
    }
  } else{
  	try{
      await fs.unlink(`./commerce-photos/product-photos/${req.file.filename}`);
  	} catch(err){
      console.log(err);
      console.error('No se ha podido eliminar el archivo!');
  	}
    return res.json({result: 'Debes subir una foto/imagen (archivo png o jpg), no un tipo de archivo diferente.'});
  }
});

router.delete('/delete-product', async (req, res)=>{
  try{
    await stock.destroy({
      where: {
        commerceName: req.user,
        productName: req.body.productName
      }
    });
    res.json({result: 'El producto ha sido eliminado!'});
  } catch(err){
    res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
  }
});

router.put('/update-product', async (req, res)=>{
  req.body.productName=validator.trim(req.body.productName); req.body.productName=validator.escape(req.body.productName);
  req.body.classification=validator.trim(req.body.classification); req.body.classification=validator.escape(req.body.classification);
  req.body.availableQuantity=validator.trim(req.body.availableQuantity); req.body.amount=validator.escape(req.body.availableQuantity);
  req.body.price=validator.trim(req.body.price); req.body.price=validator.escape(req.body.price);
  //Btw, optional update photo. I need multer and fs (fs for delete the old photo)
  try{
    let products=await stock.update({
        productName: req.body.productName,
        classification: req.body.classification,
        availableQuantity: req.body.availableQuantity,
        price: req.body.price
      }, {
      where:{
        commerceName: req.user,
        productName: req.body.productName
      }
    });
    res.json({result: 'Operacion exitosa!'});
  } catch(err){
    res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
  }
});

router.get('/purchases', (req, res)=>{
  res.sendFile(viewPath+'/purchases.html');
});

router.get('/purchases/data', async (req, res)=>{
  try{
    let data=await purchases.findAll({
      where: {
        commerceName: req.user
      }
    });
    res.json({message: 'Sucessfull operation', result: data});
  } catch(err){
    res.json({message: 'Failed operation'});
  }
});

router.get('/account-settings', (req, res)=>{
  res.sendFile(viewPath+'/account-settings-commerce.html');
});



module.exports=router;