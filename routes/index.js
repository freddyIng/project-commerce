const router=require('express').Router();
const viewPaths=__dirname.replace('/routes', '/views');

//requerimentes for the local login
const classPath=__dirname.replace('/routes', '/src/classes/backend/');
const customer=require(classPath+'customer.js');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const { body, validationResult }=require('express-validator');
const bcrypt=require('bcrypt');
const saltRounds=10;

const validator=require('validator');
passport.use('local-login', new LocalStrategy(async (username, password, done)=>{
  try{
    username=validator.trim(username);
    username=validator.escape(username);
    password=validator.trim(password);
    password=validator.escape(password);
      let hashPassword=await customer.findAll({attributes: ['password'],
        where: {
          dni: username
      }});
      if (hashPassword.length===1){
        bcrypt.compare(password, hashPassword[0].dataValues.password, async (err, result)=>{
          if (err) return done(null, false, {message: 'Username or password incorrect'});
          if (result){
            let theCustomer=await customer.findAll({
              where: {
                dni: username
              }
            });
            //Que mierda javascript. Si variable=[], variable===[] es false... Por eso use length. findAll retorna [] si no encuentra nada.
            //Se supone que el findAll retorna un array de objetos, donde cada objeto es una fila de la tabla de la base de datos.
            if (theCustomer.length===0){ //I am not sure if the user doesnt exist, this is null. I will check the sequelize documentation
              return done(null, false, {message: 'Username or password incorrect'});
            }
            theCustomer=theCustomer[0];
            return done(null, theCustomer);
          } else{
            return done(null, false, {message: 'Username or password incorrect'});
          }
        });
      } else{
        return done(null, false, {message: 'Username or password incorrect'});
      }
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

router.get('/', (req, res)=>{
  req.isAuthenticated()? res.sendFile(`${viewPaths}/customer/catalogue.html`): res.sendFile(`${viewPaths}/customer/index.html`);
});

/*body('username').trim().escape(),
body('password').trim().escape()*/

router.post('/login', passport.authenticate('local-login', { successRedirect: '/customer/catalogue',
                                   failureRedirect: '/' }));

module.exports=router;