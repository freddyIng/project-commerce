(async function app(){
  let productsDataObject=new productsData()
  let data=await productsDataObject.getProducts()
  const addProductForm=<AddProductForm />
  const searchProduct=<SearchProduct />
  const list=<List products={data.products}/>
  ReactDOM.render(
    <div>
      {addProductForm}
      {searchProduct}
      {list}
    </div>,
    document.getElementById('root')
  )
  })()