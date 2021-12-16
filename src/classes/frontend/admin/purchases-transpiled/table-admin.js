class TableAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchases: this.props.purchases,
      itemsModal: []
    };
    this.changeModalState = this.changeModalState.bind(this);
    this.changeTransactionStatus = this.changeTransactionStatus.bind(this);
  }

  componentDidMount() {
    socket.on('new purchase', data => {
      alert('Tienes una nueva compra!'); //I update the state with the new purchase. And I put in the beginning of the array, so, will render as the first.

      let newPurchasesState = this.state.purchases;
      newPurchasesState.unshift(data);
      this.setState({
        purchases: newPurchasesState
      }); //Next, I update the state of view by the admin in the database making a request.

      fetch('/admin/purchases/change/view-by-admin-status', {
        method: 'PUT'
      });
    });
  }

  changeModalState(items) {
    this.setState({
      itemsModal: items
    });
  }

  async changeTransactionStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber) {
    const status = verificationOrDelivery ? 'verification-status' : 'delivery-status';
    let data = {
      newState: event.target.value,
      dni: customerDni,
      transactionNumber: referenceTransactionNumber
    };
    data = JSON.stringify(data);
    let request = await fetch(`/admin/purchases/change/${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    let response = await request.json();

    if (response.message === 'Sucessfull operation') {
      socket.emit('change status purchase', {
        dni: customerDni,
        statusType: verificationOrDelivery ? 'Verificacion' : 'Entrega',
        state: event.target.value,
        referenceNumber: referenceTransactionNumber
      });
      alert('El estado de la transaccion ha sido cambiado con exito!');
    } else {
      alert('Ha ocurrido un error. Intentelo de nuevo');
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
      className: "table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cedula del comprador"), /*#__PURE__*/React.createElement("th", null, "Productos"), /*#__PURE__*/React.createElement("th", null, "Precio total"), /*#__PURE__*/React.createElement("th", null, "Metodo de pago"), /*#__PURE__*/React.createElement("th", null, "Numero de referencia de la transaccion"), /*#__PURE__*/React.createElement("th", null, "Estado de la transaccion"), /*#__PURE__*/React.createElement("th", null, "Pedido entregado"))), /*#__PURE__*/React.createElement("tbody", null, this.state.purchases.map(purchase => {
      let remainingVerificationStatus = [];

      switch (purchase.verificationStatus) {
        case 'Pendiente':
          remainingVerificationStatus.push('Validada');
          remainingVerificationStatus.push('Invalidada');
          break;

        case 'Validada':
          remainingVerificationStatus.push('Invalidada');
          remainingVerificationStatus.push('Pendiente');
          break;

        case 'Invalidada':
          remainingVerificationStatus.push('Validada');
          remainingVerificationStatus.push('Pendiente');
      }

      return /*#__PURE__*/React.createElement("tr", {
        key: purchase.referenceTransactionNumber
      }, /*#__PURE__*/React.createElement("td", null, purchase.customerDni), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-success",
        "data-bs-toggle": "modal",
        "data-bs-target": "#products",
        onClick: () => this.changeModalState(purchase.items)
      }, "Ver productos")), /*#__PURE__*/React.createElement("td", null, purchase.totalPrice), /*#__PURE__*/React.createElement("td", null, purchase.paymentMethod), /*#__PURE__*/React.createElement("td", null, purchase.referenceTransactionNumber), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("select", {
        className: "form-select",
        onChange: e => this.changeTransactionStatus(e, true, purchase.customerDni, purchase.referenceTransactionNumber)
      }, /*#__PURE__*/React.createElement("option", {
        value: purchase.verificationStatus
      }, purchase.verificationStatus), /*#__PURE__*/React.createElement("option", {
        value: remainingVerificationStatus[0]
      }, remainingVerificationStatus[0]), /*#__PURE__*/React.createElement("option", {
        value: remainingVerificationStatus[1]
      }, remainingVerificationStatus[1]))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("select", {
        className: "form-select",
        onChange: e => this.changeTransactionStatus(e, false, purchase.customerDni, purchase.referenceTransactionNumber)
      }, /*#__PURE__*/React.createElement("option", {
        value: purchase.deliveryStatus ? 'Si' : 'No'
      }, purchase.deliveryStatus ? 'Si' : 'No'), /*#__PURE__*/React.createElement("option", {
        value: purchase.deliveryStatus ? 'No' : 'Si'
      }, purchase.deliveryStatus ? 'No' : 'Si'))));
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