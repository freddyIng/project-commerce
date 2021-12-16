(async function main() {
  const data_ = new data();
  const products = await data_.getProducts();
  ReactDOM.render( /*#__PURE__*/React.createElement(Grid, {
    products: products.products
  }), document.getElementById('root'));
})();