const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const commerce=require(`${classPath}commerce.js`);
const stock=require(classPath+'stock.js');
const multer=require('multer');
const upload=multer({dest: `commerce-photos/product-photos`}); /*Debo hallar la manera de subir la foto a la subcarpeta del negocio
Supongo que podria trasladar la foto desde ese directorio al subdirectorio dle negocio usando fs. Y si no existe el directorio,
quiere decir que el administrador todavia no ha subido ningun producto, y por lo tanto, tendra que crearse por primera vez.*/
const fs=require('fs').promises;

router.get('/', (req, res)=>{
  res.sendFile(viewPath+'/admin-login.html');
});

//const session=require('express-session');
/*const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy(async (username, password, done)=>{
  try{
    //Remember that bcrypt must be used for hash the password and compare with the hash password of database. Also, remember
    //the validation and sanitization of the username and password
    let commerceAdmin=await commerce.findAll({
      where: {
        email: username,
        password: password
      }
    });
    //Que mierda javascript. Si variable=[], variable===[] es false... Por eso use length. findAll retorna [] si no encuentra nada.
    //Se supone que el findAll retorna un array de objetos, donde cada objeto es una fila de la tabla de la base de datos.
    if (commerceAdmin.length===0){ //I am not sure if the user doesnt exist, this is null. I will check the sequelize documentation
      return done(null, false, {message: 'Username or password incorrect'});
    }
    commerceAdmin=commerceAdmin[0];
    return done(null, commerceAdmin);
  } catch(err){
    console.log('Error en el inicio de sesion del usuario.');
    return done(err);
  }
}));

passport.serializeUser((user, done)=>{
  return done(null, user.commerceName);
});

passport.deserializeUser(async (id, done)=>{
  try{
    let commerceAdmin=await commerce.findAll({
      where: {
        commerceName: id
      }
    });
    if (commerceAdmin.length===1){
      return done(false, id); //Si esta el usuario, por lo que error valdra false
    } else{
      return done(true, id);
    }
  } catch(err){
    console.log('Error en la desearilizacion del usuario.');
    return done(err, id);
  }
});

//Post verb beacause is more secure (dont show the parameters of the user in the url).
router.post('/login', passport.authenticate('local-login', { successRedirect: '/admin/inventory',
                                   failureRedirect: '/admin' }));*/

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

router.post('/signin', async (req, res)=>{
  if (req.file.mimetype==='image/png' || req.file.mimetype==='image/jpeg'){
    try{
      /*The photo path will be in the directory photos/commerce_photos/{commerceName}/{commercePhotoPath} where
      the commercePhotoPath will be the generated number or string of the multer module*/
      let newCommerce=await commerce.create({commerceName: req.body.commerceName, descriptionOfTheCommerce: req.body.descriptionOfTheCommerce, email:
        req.body.email, phoneNumber: req.body.phoneNumber, password: req.body.password, state: req.body.state, city: req.body.city,
        direction: req.body.direction, commercePhotoPath: req.file.path});
      res.send('Operacion exitosa');
    } catch(err){
      console.log(err);
      console.log(await deleteFile(req.file.filename));
    }
  } else{
    console.log(await deleteFile(req.file.filename));
    return res.send('Debes subir una foto/imagen (archivo png o jpg), no un tipo de archivo diferente.');
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

router.post('/add-product', upload.single('productPhoto'), async (req, res)=>{
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
        console.error('No se ha podido mover la foto del producto a su subdirectorio correspondiente!');
      }
      await stock.create({commerceName: req.user, productName: req.body.productName, classification: req.body.classification, 
      availableQuantity: req.body.amount, price: req.body.price, productPhotoPath: req.file.path});
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

router.get('/admin/account-settings', (req, res)=>{
  res.sendFile(viewPath+'/account-settings-commerce.html');
});



module.exports=router;