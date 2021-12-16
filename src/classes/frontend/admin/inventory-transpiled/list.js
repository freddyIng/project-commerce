class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products
    };
    this.additem = this.addItem.bind(this);
  }

  componentDidMount() {
    eventBus.on('addItemToTheList', data => {
      this.addItem(data);
    });
    eventBus.on('searchProducts', data => {
      const characters = new RegExp(`^${data.characters}`);
      let result = [];
      this.props.products.forEach(product => {
        if (characters.test(product.productName)) {
          result.push(product);
        }
      });
      this.setState({
        products: result
      });
    });
  }

  addItem(data) {
    let newProductsState = this.state.products;
    newProductsState.push(data);
    this.setState({
      products: newProductsState
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("ul", {
      className: "list-group"
    }, this.state.products.map(product => {
      return /*#__PURE__*/React.createElement(Item, {
        key: product.productName,
        nameContainer: textContainer('Nombre', product.productName),
        name: product.productName,
        availableQuantityContainer: textContainer('Cantidad disponible', product.availableQuantity),
        availableQuantity: product.availableQuantity,
        priceContainer: textContainer('Precio', product.price),
        price: product.price,
        src: product.productPhotoPath
      });
    }));
  }

}