const router=require('express').Router();
const viewPath=__dirname.replace('/routes', '/views');
const classPath=__dirname.replace('/routes', '/classes/backend/');
const stock=require(classPath+'stock.js');
const multer=require('multer');
const upload=multer({dest: `commerce-photos/product-photos`}); /*Debo hallar la manera de subir la foto a la subcarpeta del negocio
Supongo que podria trasladar la foto desde ese directorio al subdirectorio dle negocio usando fs. Y si no existe el directorio,
quiere decir que el administrador todavia no ha subido ningun producto, y por lo tanto, tendra que crearse por primera vez.*/
const fs=require('fs').promises;

router.get('/inventory', (req, res)=>{
  res.sendFile(viewPath+'/inventory.html');
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
  try{
    let products=await stock.update({}, {
      where:{
        commerceName: req.user,
        productName: req.body.productName
      }
    });
    res.json({result: products});
  } catch(err){
    res.json({result: 'Ha ocurrido un error. Intentelo de nuevo!'});
  }
});

module.exports=router;