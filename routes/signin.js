const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views/');
const classesPath=__dirname.replace('/routes', '/classes/backend/')
const commerce=require(`${classesPath}commerce.js`);
const multer=require('multer');
const upload=multer({dest: 'commerce-photos/'});

router.get('/', (req, res)=>{
  res.sendFile(`${viewPath}signin.html`);
});


async function deleteFile(fileName){
  try{
    await fs.unlink(`./commerce-photos/${filename}`);
    return 'Operacion exitosa!';
  } catch(err){
    return 'Error';
  }
}

//First I validate and sanitize the data before save the data in the database
router.post('/', upload.single('commercePhoto'), async (req, res)=>{
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

module.exports=router;