class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products
    };
  }

  componentDidMount() {
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

  render() {
    return /*#__PURE__*/React.createElement("ul", {
      className: "list-group"
    }, this.state.products.map(product => {
      return /*#__PURE__*/React.createElement(Item, {
        key: product.productName,
        name: product.productName,
        availableQuantity: product.availableQuantity,
        price: product.price,
        src: product.productPhotoPath
      });
    }));
  }

}