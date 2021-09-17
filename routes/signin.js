const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views/');
//const classesPath=__dirname.replace('/routes', '/classes/backend/')
//const commerce=require(`./${classesPath}commerce.js`);
console.log(viewPath);
router.get('/', (req, res)=>{
  console.log(viewPath);
  res.sendFile(`${viewPath}signin.html`);
});

router.post('/', async (req, res)=>{
  //First I validate and sanitize the data before save the data in the database
  try{
  	/*The photo path will be in the directory photos/commerce_photos/{commerceName}/{commercePhotoPath} where
  	the commercePhotoPath will be the generated number or string of the multer module*/
    await commerce.create({commerceName: req.body.commerceName, descriptionOfTheCommerce: req.body.descriptionOfTheCommerce, email:
      req.body.email, phoneNumber: req.body.phoneNumber, password: req.body.password, state: req.body.state, city: req.body.city,
      direction: req.body.direction});
    res.json({result: 'Operacion exitosa'});
  } catch(err){
    res.json({result: 'Ha ocurrido un error. Intentelo de nuevo'});
  }
});

module.exports=router;