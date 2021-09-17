const router=require('express').Router();
//let path=require('path');
const viewPaths=__dirname.replace('/routes', '/views');
router.get('/', (req, res)=>{
  res.sendFile(`${viewPaths}/index.html`);
});

module.exports=router;