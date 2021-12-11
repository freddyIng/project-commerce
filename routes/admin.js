const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const admin=require(`${classPath}admin.js`);
const purchases=require(`${classPath}purchase.js`);
const stock=require(classPath+'stock.js');
const multer=require('multer');
const upload=multer({dest: `commerce-photos/product-photos`});
const { body, validationResult }=require('express-validator');
const cookieParser=require('cookie-parser');
router.use(cookieParser());
const cookieValue='fqeoufb872b78f2b78f3278b23f1f1';
const bcrypt=require('bcrypt');
const saltRounds=10;
/*Debo hallar la manera de subir la foto a la subcarpeta del negocio
Supongo que podria trasladar la foto desde ese directorio al subdirectorio dle negocio usando fs. Y si no existe el directorio,
quiere decir que el administrador todavia no ha subido ningun producto, y por lo tanto, tendra que crearse por primera vez.*/
const fs=require('fs').promises;

router.get('/', (req, res)=>{
  res.sendFile(viewPath+'/admin/login.html');
});

async function deleteFile(fileName){
  try{
    await fs.unlink(`./commerce-photos/${filename}`);
    return 'Operacion exitosa!';
  } catch(err){
    return 'Error';
  }
}

router.post('/login', async (req, res)=>{
  let result=await admin.findAll({where: {
    username: req.body.username,
    password: req.body.password
  }});
  if (result.length===0){
    res.send('Usuario o contraseña incorrecta!');
  } else{
  	res.cookie('admin_session', cookieValue).redirect('/admin/inventory');
  }
});

router.get('/logout', (req, res)=>{
  res.clearCookie("admin_session");
  res.redirect('/');
});


router.get('/edit-payment-information', (req, res)=>{
  req.cookies.admin_session===cookieValue? res.sendFile(viewPath+'/admin/edit-payment-information.html') : res.send('Acceso denegado');
});

router.get('/payment-information', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    try{
      let data=await admin.findAll({attributes: ['paymentInformation']});
      res.json({message: 'Sucessfull operation', result: data});
    } catch(err){
      res.json({message: 'Failed operation'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

router.put('/edit-payment-information', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    try{
      await admin.update({paymentInformation: req.body},
      	{where: {
          username: 'cyber'
        }
      });
      res.json({result: 'Sucessfull operation'});
    } catch(err){
      console.log(err)
      res.json({result: 'Failed operation'});
    }
  }
});

router.get('/inventory', (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    res.sendFile(viewPath+'/admin/inventory.html');
  } else{
  	res.send('Acceso denegado')
  }
});

router.get('/get-products', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    try{
      let products=await stock.findAll({});
      return res.json({result: products});
    } catch(err){
      return res.json({result: 'Ha ocurrido un error.'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

const validator=require('validator');

router.post('/add-product/data', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    req.body.productName=validator.trim(req.body.productName); req.body.productName=validator.escape(req.body.productName);
    req.body.amount=validator.trim(req.body.amount); req.body.amount=validator.escape(req.body.amount);
    req.body.price=validator.trim(req.body.price); req.body.price=validator.escape(req.body.price);
    try{
      await stock.create({productName: req.body.productName, 
        availableQuantity: req.body.amount, price: req.body.price});
      res.json({message: 'Sucessfull operation'});
    } catch(err){
      res.json({message: 'Failed operation!'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

router.post('/add-product/photo', upload.single('productPhoto'), async (req, res)=>{
    if (req.cookies.admin_session===cookieValue){
     req.body.productName=validator.trim(req.body.productName); req.body.productName=validator.escape(req.body.productName);
  /*Apart from the photo, I get the product and the commerce name. If the file is a image, then I save the path in database.
  If not, then I delete the image and the product in the database*/
  if (req.file.mimetype==='image/png' || req.file.mimetype==='image/jpeg'){
    try{
      await stock.update({productPhotoPath: `/product-photos/${req.file.filename}`}, {
        where: {
          productName: req.body.productName
        }
      });
      return res.json({message: 'Sucessfull operation', photoPath: `/product-photos/${req.file.filename}`});
    } catch(err){
      console.log(err);
      return res.json({message: 'Ha ocurrido un error al momento de guardar tu foto en el servidor.'});
    }
  } else{
    try{
      await fs.unlink(`./commerce-photos/product-photos/${req.file.filename}`);
    } catch(err){
      console.log(err);
      console.error('No se ha podido eliminar el archivo!');
    } finally{
      return res.json({message: 'Debes subir una foto/imagen (archivo png o jpg), no un tipo de archivo diferente.'});
    }
   }
  } else{
  	res.send('Acceso denegado')
  }
});

router.delete('/delete-product', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    try{
      await stock.destroy({
        where: {
          productName: req.body.productName
        }
    });
    //I need get the name of the photo from the request, so, I don't need a query to dabase for know the path of the photo
    await fs.unlink('.'+'/commerce-photos'+req.body.photoPath);
    res.json({result: 'El producto ha sido eliminado!'});
    } catch(err){
      console.log(err)
      res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

router.put('/update-product', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    req.body.productName=validator.trim(req.body.productName); req.body.productName=validator.escape(req.body.productName);
    req.body.availableQuantity=validator.trim(req.body.availableQuantity); req.body.amount=validator.escape(req.body.availableQuantity);
    req.body.price=validator.trim(req.body.price); req.body.price=validator.escape(req.body.price);
    //Btw, optional update photo. I need multer and fs (fs for delete the old photo)
    try{
      let products=await stock.update({
        productName: req.body.productName,
        availableQuantity: req.body.availableQuantity,
        price: req.body.price
       }, {
       where:{
        productName: req.body.productName
       }
      });
      res.json({result: 'Operacion exitosa!'});
    } catch(err){
      res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

router.get('/purchases', (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
  	res.sendFile(viewPath+'/admin/purchases.html');
  } else{
  	res.send('Acceso denegado')
  }
});

router.get('/purchases/data', async (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    try{
      let data=await purchases.findAll({});
      res.json({message: 'Sucessfull operation', result: data});
    } catch(err){
      console.log(err)
      res.json({message: 'Failed operation'});
    }
  } else{
  	res.send('Acceso denegado')
  }
});

router.put('/purchases/change/verification-status', async (req, res)=>{
  try{
    await purchases.update({verificationStatus: req.body.newState}, {
      where: {
        customerDni: req.body.dni,
        referenceTransactionNumber: req.body.transactionNumber
      }
    });
    res.json({message: 'Sucessfull operation'});
  } catch(err){
    console.log(err);
    res.json({message: 'Failed operation'});
  }
});

router.put('/purchases/change/delivery-status', async (req, res)=>{
  try{
    await purchases.update({deliveryStatus: req.body.newState==='Si'? true : false}, {
      where: {
        customerDni: req.body.dni,
        referenceTransactionNumber: req.body.transactionNumber
      }
    });
    res.json({message: 'Sucessfull operation'});
  } catch(err){
  	console.log(err);
  	res.json({message: 'Failed operation'});
  }
});

router.put('/purchases/change/view-by-admin-status', async (req, res)=>{
  try{
    await purchases.update({viewByAdministrator: true}, {
      where: {
        viewByAdministrator: false
      }
    });
  } catch(err){
    console.log(err);
  }
});

router.get('/purchases/unseen-purchases', async (req, res)=>{
  try{
    let results=await purchases.findAll({where: {
    	viewByAdministrator: false
    }});
    res.json({message: 'Sucessfull operation', purchases: results});
  } catch(err){
    console.log(err);
    res.json({message: 'error'});
  }
});

router.get('/account-settings', (req, res)=>{
  if (req.cookies.admin_session===cookieValue){
    res.sendFile(viewPath+'/account-settings-commerce.html');
  } else{
  	res.send('Acceso denegado')
  }
});



module.exports=router;