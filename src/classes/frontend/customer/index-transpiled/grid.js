class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid-container"
    }, this.props.products.map(product => {
      return /*#__PURE__*/React.createElement(Item, {
        key: product.productName,
        productName: product.productName,
        availableQuantity: product.availableQuantity,
        price: product.price,
        productPhotoPath: product.productPhotoPath
      });
    }));
  }

}