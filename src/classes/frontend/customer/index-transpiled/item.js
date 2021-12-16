class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, this.props.productName), /*#__PURE__*/React.createElement("p", null, "Cantidad disponible: ", this.props.availableQuantity), /*#__PURE__*/React.createElement("p", null, "Precio: ", this.props.price), /*#__PURE__*/React.createElement("img", {
      src: this.props.productPhotoPath
    }));
  }

}