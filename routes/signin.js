const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views/');
const classesPath=__dirname.replace('/routes', '/classes/backend/')
const commerce=require(`${classesPath}commerce.js`);
const multer=require('multer');
const upload=multer({dest: 'commerce-photos/'});

router.get('/', (req, res)=>{
  res.sendFile(`${viewPath}signin.html`);
});

router.post('/', upload.single('commercePhoto'), async (req, res)=>{
  console.log(req.file.mimetype);
  console.log(req.file.size);
  console.log(req.file.filename);
  console.log(req.file.path);
  await commerce.sync();
  //First I validate and sanitize the data before save the data in the database
  try{
  	/*The photo path will be in the directory photos/commerce_photos/{commerceName}/{commercePhotoPath} where
  	the commercePhotoPath will be the generated number or string of the multer module*/
    let newCommerce=await commerce.create({commerceName: req.body.commerceName, descriptionOfTheCommerce: req.body.descriptionOfTheCommerce, email:
      req.body.email, phoneNumber: req.body.phoneNumber, password: req.body.password, state: req.body.state, city: req.body.city,
      direction: req.body.direction, commercePhotoPath: req.file.path});
    //res.json({result: 'Operacion exitosa'})
    console.log(newCommerce);
    res.send('Operacion exitosa');
  } catch(err){
    console.log(err);
    res.send('Ha ocurrido un error. Intentelo de nuevo');
    //res.json({result: 'Ha ocurrido un error. Intentelo de nuevo'});
  }
});

module.exports=router;