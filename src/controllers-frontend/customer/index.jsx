(async function main(){
    const data_=new data()
    const products=await data_.getProducts()
    ReactDOM.render(
     <Grid products={products.products}/>,
     document.getElementById('root')
   )
 })()