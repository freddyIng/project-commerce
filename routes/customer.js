const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const customer=require(classPath+'customer.js');
const commerce=require(classPath+'commerce.js');
const purchase=require(classPath+'purchase.js');
const stock=require(classPath+'stock.js');
//const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;


passport.use('local-login', new LocalStrategy(async (username, password, done)=>{
  try{
    /*Remember that bcrypt must be used for hash the password and compare with the hash password of database. Also, remember
    the validation and sanitization of the username and password*/
    let theCustomer=await customer.findAll({
      where: {
        email: username,
        password: password
      }
    });
    /*Que mierda javascript. Si variable=[], variable===[] es false... Por eso use length. findAll retorna [] si no encuentra nada.
    Se supone que el findAll retorna un array de objetos, donde cada objeto es una fila de la tabla de la base de datos.*/
    if (theCustomer.length===0){ //I am not sure if the user doesnt exist, this is null. I will check the sequelize documentation
      return done(null, false, {message: 'Username or password incorrect'});
    }
    theCustomer=theCustomer[0];
    return done(null, theCustomer);
  } catch(err){
    console.log('Error en el inicio de sesion del usuario.');
    return done(err);
  }
}));

passport.serializeUser((user, done)=>{
  return done(null, user.dni);
});

passport.deserializeUser(async (id, done)=>{
  try{
    let theCustomer=await customer.findAll({
      where: {
        dni: id
      }
    });
    if (theCustomer.length===1){
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
router.post('/login', passport.authenticate('local-login', { successRedirect: '/customer/home-client',
                                   failureRedirect: '/' }));

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

router.get('/signin', (req, res)=>{
  res.sendFile(viewPath+'/customer/signin.html');
});

router.post('/signin', async (req, res)=>{
  console.log(req.body);
  try{
    await customer.create({
      name: req.body.name, 
      lastName: req.body.lastName, 
      dni: req.body.dni,
      password: req.body.password, 
      email: req.body.email, 
      phoneNumber: req.body.phoneNumber
    });
    res.send('The has registrado con exito! Ahora puedes iniciar sesion para empezar a usar nuestro servicio.');
  } catch(err){
    res.send('Ha ocurrido un error. Intentelo de nuevo!');
  }
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

router.post('/catalogue/buy', async (req, res)=>{
  
});

module.exports=router;