class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.transaction = this.transaction.bind(this);
    this.changeMethodName = this.changeMethodName.bind(this);
    this.changeReferenceNumber = this.changeReferenceNumber.bind(this);
    /*The user is free to change his payment method, yes, but the initial value will be the first of the shop.
    For two reasons: If the store only has one method, then the user will not be able to execute the change action, and then the value will never change. Even if there are more than two, but the user never changes, the value will remain null, since the value of the payment method will still depend on whether or not the user changes the method.*/

    this.state = {
      totalPrice: 0,
      methodName: this.props.paymentMethods[0].name,
      referenceNumber: ''
    };
  }

  changeMethodName(event) {
    this.setState({
      methodName: event.target.value
    });
  }

  changeReferenceNumber(event) {
    this.setState({
      referenceNumber: event.target.value
    });
  }
  /*-El evento confirmar del componente purchase, disparara el evento sendPurchaseData del componente shopping cart
    -El evento sendPurchaseData activara el evento receiveProductsDataFromTheShoppingCart del componente purchase
    -El evento receiveProductsDataFromTheShoppingCart activara el evento transaction del componente purchase
    -Finalmente, el evento transaction sera una solicitud fetch para registrar una compra del cliente en la respectiva tienda*/


  confirm() {
    eventBus.dispatch('sendPurchaseData', null);
  }

  componentDidMount() {
    eventBus.on('updateTotalPrice', data => {
      this.setState({
        totalPrice: data.newPrice
      });
    });
    eventBus.on('receiveProductsDataFromTheShoppingCart', data => {
      //First I obtain the total price (just multiply the price of each item with the amount, and sum, duhhh)

      /*let totalPrice=0
      data.forEach(item=>{
        totalPrice+=parseInt(item.amount)*parseInt(item.price)
      })
      data.totalPrice=totalPrice*/
      this.transaction(data);
    });
  }

  async transaction(purchaseData) {
    let data = {
      items: purchaseData,
      totalPrice: this.state.totalPrice,
      paymentMethod: this.state.methodName,
      referenceTransactionNumber: this.state.referenceNumber
    };
    let request = await fetch('/customer/catalogue/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    let response = await request.json();

    if (response.message === 'Successfull operation') {
      //Delete all the items of the shopping cart, and show the message of succesfull purchase
      eventBus.dispatch('sucessfullPurchase', null);
      data.customerDni = response.dni;
      socket.emit('new purchase', data);
      alert('Compra exitosa!');
    } else if (response.message === 'Failed operation') {
      //Show failed message...
      alert('Ha ocurrido un error. Intentelo de nuevo');
    } else if (response.message === 'Producto(s) con cantidad insuficiente') {
      let productsNotAvailable = response.result.map(item => {
        return item.name;
      });
      alert(response.message + ' Los productos que cuya cantidad pedida no esta disponible son: ' + productsNotAvailable.toString());
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "modal fade",
      id: "purchase",
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
    }, "Confirmar compra"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-close",
      "data-bs-dismiss": "modal",
      "aria-label": "Close"
    })), /*#__PURE__*/React.createElement("div", {
      className: "modal-body",
      id: "purchaseBody"
    }, /*#__PURE__*/React.createElement("p", null, "Estos son los metodos de pago y los datos usados por nombre del comercio. Haz la respectiva transaccion con alguno de estos metodos y luego confirma la transaccion"), this.props.paymentMethods.map(method => {
      return /*#__PURE__*/React.createElement("p", {
        key: method.name
      }, method.name + ' ' + method.id + ' ' + method.accountNumber);
    }), /*#__PURE__*/React.createElement("p", null, "El precio total de tu compra es ", this.state.totalPrice), /*#__PURE__*/React.createElement("p", null, "Selecciona tu metodo de pago"), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      id: "exampleFormControlSelect1",
      value: this.state.methodName,
      onChange: this.changeMethodName
    }, this.props.paymentMethods.map(method => {
      return /*#__PURE__*/React.createElement("option", {
        className: "form-control",
        key: method.name
      }, method.name);
    })), /*#__PURE__*/React.createElement("p", null, "Introduce el numero de referencia de tu transaccion"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "referenceNumberClient",
      value: this.state.referenceNumber,
      onChange: this.changeReferenceNumber
    })), /*#__PURE__*/React.createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-success",
      "data-bs-dismiss": "modal",
      id: "confirmPurchase",
      onClick: this.confirm
    }, "Confirmar compra"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger",
      "data-bs-dismiss": "modal"
    }, "Cerrar")))));
  }

}