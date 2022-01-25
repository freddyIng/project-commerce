class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.state = {
      items: [],
      totalPrice: 0
    };
  }

  componentDidMount() {
    eventBus.on('addItem', data => {
      this.addItem(data);
    });
    eventBus.on('sendPurchaseData', data => {
      let productsData = this.state.items;
      eventBus.dispatch('receiveProductsDataFromTheShoppingCart', productsData);
    });
    eventBus.on('sucessfullPurchase', data => {
      //The user has buyed the items, so, the shopping cart now is empty
      this.setState({
        items: []
      });
    });
  }

  addItem(item) {
    //First, I check if the product exist in the cart. In the case that exist, the amount of that item up to +1
    let i = 0,
        flag = false,
        itemIndex = -1;

    while (i < this.state.items.length && !flag) {
      if (this.state.items[i].name === item.name) {
        flag = true;
        itemIndex = i;
      }

      i++;
    }

    let newItemsValue = this.state.items;

    if (!flag) {
      item.amount = 1;
      newItemsValue.push(item);
      this.setState({
        items: newItemsValue
      });
    } else {
      newItemsValue[itemIndex].amount += 1;
      this.setState({
        items: newItemsValue
      });
    } //I calculate the total price again


    let newTotalPrice = 0;
    this.state.items.forEach(item => {
      newTotalPrice += parseInt(item.amount) * parseInt(item.price);
    });
    this.setState({
      totalPrice: newTotalPrice
    });
    /*Next, I update the total price in the purchase modal.
    Btw, setState is asyncrhonous. For that, I send the newTotalPrice, not the state*/

    eventBus.dispatch('updateTotalPrice', {
      newPrice: newTotalPrice
    });
  }

  async deleteItem(itemName) {
    //I get the index of the item in the array state, and I update from that
    let i = 0,
        flag = false,
        itemIndex = -1;

    while (i < this.state.items.length || !flag) {
      if (this.state.items[i].name === itemName) {
        flag = true;
        itemIndex = i;
      }

      i++;
    }

    let newItemsValue = [];

    for (let i = 0; i < this.state.items.length; i++) {
      if (i !== itemIndex) {
        newItemsValue.push(this.state.items[i]);
      }
    }

    await this.setState({
      items: newItemsValue
    }); //I calculate the total price again

    let newTotalPrice = 0;
    this.state.items.forEach(item => {
      newTotalPrice += parseInt(item.amount) * parseInt(item.price);
    });
    await this.setState({
      totalPrice: newTotalPrice
    });
    eventBus.dispatch('updateTotalPrice', {
      newPrice: this.state.totalPrice
    });
  }

  buy() {//Just show the purchase modal
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "modal fade",
      id: "cart",
      tabIndex: "-1",
      "aria-labelledby": "exampleModalLabel",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-dialog"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-header"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "modal-title",
      id: "exampleModalLabel"
    }, "Carrito de compra"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-close",
      "data-bs-dismiss": "modal",
      "aria-label": "Close"
    })), /*#__PURE__*/React.createElement("div", {
      className: "modal-body",
      id: "cartBody"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Producto"), /*#__PURE__*/React.createElement("th", null, "Precio"), /*#__PURE__*/React.createElement("th", null, "Cantidad"))), /*#__PURE__*/React.createElement("tbody", null, this.state.items.map(item => {
      return /*#__PURE__*/React.createElement("tr", {
        key: item.name
      }, /*#__PURE__*/React.createElement("td", null, item.name), /*#__PURE__*/React.createElement("td", null, item.price), /*#__PURE__*/React.createElement("td", null, item.amount), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
        onClick: () => this.deleteItem(item.name),
        className: "btn btn-danger"
      }, "Quitar")));
    })))), /*#__PURE__*/React.createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      id: "buy",
      "data-bs-dismiss": "modal",
      "data-bs-toggle": "modal",
      "data-bs-target": "#purchase",
      onClick: this.buy
    }, "Comprar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger",
      "data-bs-dismiss": "modal"
    }, "Cerrar")))));
  }

}