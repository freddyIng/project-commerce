const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const customer=require(classPath+'customer.js');
const session=require('express-session');
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

router.get('/get', (req, res)=>{
  res.sendFile(`${viewPaths}/signin-customer.html`);
});

router.post('/signin', async (req, res)=>{
  try{
    await customer.create({
      name: req.body.name, 
      lastName: req.body.lastName, 
      dni: req.body.dni, 
      email: req.body.email, 
      phoneNumber: req.body.phoneNumber
    });
  } catch(err){
    res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
  }
});



module.exports=router;