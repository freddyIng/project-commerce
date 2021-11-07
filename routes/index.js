const router=require('express').Router();
const viewPaths=__dirname.replace('/routes', '/views');

//requerimentes for the local login
const classPath=__dirname.replace('/routes', '/classes/backend/');
const commerce=require(classPath+'commerce.js');
const customer=require(classPath+'customer.js');
/*So... maybe I use the req.body.username like the difference at the moment of login. If is a string, then is a admin. If is a number,
is a client*/
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy(async (username, password, done)=>{
  try{
  	//Remember that bcrypt must be used for hash the password and compare with the hash password of database. Also, remember
  	//the validation and sanitization of the username and password
    if (isNaN(parseInt(username))){
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
    } else if (typeof parseInt(username)==='number'){
      let theCustomer=await customer.findAll({
        where: {
          dni: username,
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
    }
  } catch(err){
    console.log('Error en el inicio de sesion del usuario.');
    return done(err);
  }
}));

passport.serializeUser((user, done)=>{
  if (user.dni!==undefined){
    return done(null, user.dni); 
  }
  return done(null, user.commerceName);
});

passport.deserializeUser(async (id, done)=>{
  try{
    if (typeof id==='string'){
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
    } else if (typeof id==='number'){
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
    }
  } catch(err){
    console.log('Error en la desearilizacion del usuario.');
    return done(err, id);
  }
});

router.get('/', (req, res)=>{
  if (req.isAuthenticated()){
    /*I need know if the user is a commerce or  a client commmerce...So, if the req.user is a string, is a commerce (commerceName).
    Otherwise is a client of commerces (dni, aka a number)*/
    isNaN(parseInt(req.user)) ?res.sendFile(`${viewPaths}/inventory.html`): res.sendFile(`${viewPaths}/home-client.html`);
  } else{
    res.sendFile(`${viewPaths}/index.html`);
  }
});

function test(username){
  let route='';
  if (isNaN(parseInt(username))){
    route='/admin/inventory'
  } else if (typeof parseInt(username)==='number'){
    route='/customer/home-client'
  }
  return route;
}

router.get('/login/which-path', (req, res)=>{
  if (isNaN(parseInt(req.user))){
    res.redirect('/admin/inventory');
  } else if (typeof parseInt(req.user)==='number'){
    res.redirect('/customer/home-client');
  }
});

router.post('/login', passport.authenticate('local-login', { successRedirect: '/login/which-path',
                                   failureRedirect: '/' }));

//Post verb beacause is more secure (dont show the parameters of the user in the url).

/*This methods doesn't work. For that, I redirect to a second route for decide wich path (client or admin)
router.post('/login', (req, res)=>{
  let route='';
  if (isNaN(parseInt(req.body.username))){
    route='/admin/inventory'
  } else if (typeof parseInt(req.body.username)==='number'){
    route='/customer/home-client'
  }
  return passport.authenticate('local-login', { successRedirect: [route],
                                   failureRedirect: '/' });
});


router.post('/login', passport.authenticate('local-login', { successRedirect: [test(req.body.username)],
                                   failureRedirect: '/' })
);*/

module.exports=router;