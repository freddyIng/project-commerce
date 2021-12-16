(async function app(){
  let productsDataObject=new productsData()
  let data=await productsDataObject.getProducts()
  let paymentData=new paymentInformation()
  const cart=<ShoppingCart />
  const purchase=<Purchase paymentMethods={await paymentData.getData()}/>
  const searchProduct=<SearchProduct />
  const list=<List products={data.products} />
  ReactDOM.render(
    <div>
      {searchProduct}
      {list}
      {cart}
      {purchase}
    </div>,
    document.getElementById('root')
  )
})()


