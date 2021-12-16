class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchases: this.props.purchases,
      itemsModal: []
    };
    this.changeModalState = this.changeModalState.bind(this);
  }

  changeModalState(items) {
    this.setState({
      itemsModal: items
    });
  }

  componentDidMount() {
    socket.on('change status purchase', data => {
      let newStatePurchases = this.state.purchases;
      let i = 0,
          flag = false,
          purchaseIndex = -1;

      while (i < this.state.purchases.length && !flag) {
        if (this.state.purchases[i].referenceTransactionNumber === data.referenceNumber) {
          flag = true;
          purchaseIndex = i;
        }

        i++;
      }

      if (data.statusType === 'Verificacion') {
        newStatePurchases[purchaseIndex].verificationStatus = data.state;
      } else if (data.statusType === 'Entrega') {
        newStatePurchases[purchaseIndex].deliveryStatus = data.state === 'Si' ? true : false;
      }

      this.setState({
        purchases: newStatePurchases
      });
      alert('El estado de tu compra ha cambiado!');
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
      className: "table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Productos"), /*#__PURE__*/React.createElement("th", null, "Precio total"), /*#__PURE__*/React.createElement("th", null, "Metodo de pago"), /*#__PURE__*/React.createElement("th", null, "Numero de referencia de la transaccion"), /*#__PURE__*/React.createElement("th", null, "Estado de la transaccion"), /*#__PURE__*/React.createElement("th", null, "Pedido entregado"))), /*#__PURE__*/React.createElement("tbody", null, this.state.purchases.map(purchase => {
      return /*#__PURE__*/React.createElement("tr", {
        key: purchase.referenceTransactionNumber
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-success",
        "data-bs-toggle": "modal",
        "data-bs-target": "#products",
        onClick: () => this.changeModalState(purchase.items)
      }, "Ver productos")), /*#__PURE__*/React.createElement("td", null, purchase.totalPrice), /*#__PURE__*/React.createElement("td", null, purchase.paymentMethod), /*#__PURE__*/React.createElement("td", null, purchase.referenceTransactionNumber), /*#__PURE__*/React.createElement("td", null, purchase.verificationStatus), /*#__PURE__*/React.createElement("td", null, purchase.deliveryStatus ? 'Si' : 'No'));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "modal fade",
      id: "products",
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
    }, "Productos que compro el cliente"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-close",
      "data-bs-dismiss": "modal",
      "aria-label": "Close"
    })), /*#__PURE__*/React.createElement("div", {
      className: "modal-body"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Producto"), /*#__PURE__*/React.createElement("th", null, "Cantidad"), /*#__PURE__*/React.createElement("th", null, "Precio"))), /*#__PURE__*/React.createElement("tbody", null, this.state.itemsModal.map(item => {
      return /*#__PURE__*/React.createElement("tr", {
        key: item.name
      }, /*#__PURE__*/React.createElement("td", null, item.name), /*#__PURE__*/React.createElement("td", null, item.amount), /*#__PURE__*/React.createElement("td", null, item.price));
    })))), /*#__PURE__*/React.createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger",
      "data-bs-dismiss": "modal"
    }, "Cerrar"))))));
  }

}