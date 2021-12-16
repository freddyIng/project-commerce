(async function app() {
  let productsDataObject = new productsData();
  let data = await productsDataObject.getProducts();
  let paymentData = new paymentInformation();
  const cart = /*#__PURE__*/React.createElement(ShoppingCart, null);
  const purchase = /*#__PURE__*/React.createElement(Purchase, {
    paymentMethods: await paymentData.getData()
  });
  const searchProduct = /*#__PURE__*/React.createElement(SearchProduct, null);
  const list = /*#__PURE__*/React.createElement(List, {
    products: data.products
  });
  ReactDOM.render( /*#__PURE__*/React.createElement("div", null, searchProduct, list, cart, purchase), document.getElementById('root'));
})();