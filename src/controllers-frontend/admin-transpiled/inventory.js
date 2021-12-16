(async function app() {
  let productsDataObject = new productsData();
  let data = await productsDataObject.getProducts();
  const addProductForm = /*#__PURE__*/React.createElement(AddProductForm, null);
  const searchProduct = /*#__PURE__*/React.createElement(SearchProduct, null);
  const list = /*#__PURE__*/React.createElement(List, {
    products: data.products
  });
  ReactDOM.render( /*#__PURE__*/React.createElement("div", null, addProductForm, searchProduct, list), document.getElementById('root'));
})();