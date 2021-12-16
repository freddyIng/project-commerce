class Item extends React.Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
    this.state = {
      addToCartButtonColor: 'btn btn-warning'
    };
  }

  addToCart() {
    //I change the color of the botton (changin the state color, a class of the button) for like 0.5 seconds
    this.setState({
      addToCartButtonColor: 'btn btn-primary'
    });
    setTimeout(() => this.setState({
      addToCartButtonColor: 'btn btn-warning'
    }), 250); //This will fire the event "addItem" of the shopping cart component. 

    /*The propsobject is not extensible, so, I send a new object with the props of interest, not the this.props, because,
    the property amount will be necessary in the shopping cart component*/

    let itemData = {
      name: this.props.name,
      price: this.props.price,
      src: this.props.src
    };
    eventBus.dispatch('addItem', itemData);
  }

  render() {
    return /*#__PURE__*/React.createElement("li", {
      className: "list-group-item"
    }, /*#__PURE__*/React.createElement("p", null, "Nombre: ", this.props.name), /*#__PURE__*/React.createElement("p", null, "Cantidad disponible: ", this.props.availableQuantity), /*#__PURE__*/React.createElement("p", null, "Precio: ", this.props.price), /*#__PURE__*/React.createElement("img", {
      src: this.props.src,
      alt: "Foto del producto"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: this.state.addToCartButtonColor,
      onClick: this.addToCart,
      id: "addToCart"
    }, "Agregar al carrito"));
  }

}