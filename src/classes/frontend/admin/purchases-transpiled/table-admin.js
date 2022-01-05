class PurchaseVerificationStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: this.props.verificationStatus,
      selectValue: this.props.verificationStatus
    };
    this.changeTransactionVerificationStatus = this.changeTransactionVerificationStatus.bind(this);
  }

  async changeTransactionVerificationStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber) {
    if (window.confirm('Estas seguro de cambiar el estado de la transaccion? Esta accion es irreversible!')) {
      this.setState({
        selectValue: event.target.value
      });
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
        this.setState({
          viewState: data.newState
        });
        alert('El estado de la transaccion ha sido cambiado con exito!');
      } else {
        this.setState({
          selectValue: 'Pendiente'
        });
        alert('Ha ocurrido un error. Intentelo de nuevo');
      }
    } else {
      /*I return the previous value of the select element to the default (pendiente). Is enough to change the state again
      to "Pendiente" */
      this.setState({
        selectValue: 'Pendiente'
      });
    }
  }

  render() {
    return this.state.viewState === 'Pendiente' ? /*#__PURE__*/React.createElement("select", {
      value: this.state.selectValue,
      className: "form-select",
      onChange: e => this.changeTransactionVerificationStatus(e, true, this.props.customerDni, this.props.referenceTransactionNumber)
    }, /*#__PURE__*/React.createElement("option", {
      value: 'Pendiente'
    }, 'Pendiente'), /*#__PURE__*/React.createElement("option", {
      value: 'Validada'
    }, 'Validada'), /*#__PURE__*/React.createElement("option", {
      value: 'Invalidada'
    }, 'Invalidada')) : /*#__PURE__*/React.createElement("p", null, this.state.selectValue);
  }

}

class PurchaseDeliveryStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: this.props.deliveryStatus ? 'Si' : 'No',
      selectValue: this.props.deliveryStatus ? 'Si' : 'No'
    };
    this.changeTransactionDeliveryStatus = this.changeTransactionDeliveryStatus.bind(this);
  }

  async changeTransactionDeliveryStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber) {
    if (window.confirm('Estas seguro de cambiar el estado de la transaccion? Esta accion es irreversible!')) {
      this.setState({
        selectValue: event.target.value
      });
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
        this.setState({
          viewState: 'Si'
        });
        alert('El estado de la transaccion ha sido cambiado con exito!');
      } else {
        alert('Ha ocurrido un error. Intentelo de nuevo');
        this.setState({
          selectValue: 'No'
        });
      }
    }
  }

  render() {
    return this.state.viewState === 'No' ? /*#__PURE__*/React.createElement("select", {
      value: this.state.selectValue,
      className: "form-select",
      onChange: e => this.changeTransactionDeliveryStatus(e, false, this.props.customerDni, this.props.referenceTransactionNumber)
    }, /*#__PURE__*/React.createElement("option", {
      value: 'No'
    }, 'No'), /*#__PURE__*/React.createElement("option", {
      value: 'Si'
    }, 'Si')) : /*#__PURE__*/React.createElement("p", null, this.state.selectValue);
  }

}

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
      return /*#__PURE__*/React.createElement("tr", {
        key: purchase.referenceTransactionNumber
      }, /*#__PURE__*/React.createElement("td", null, purchase.customerDni), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-success",
        "data-bs-toggle": "modal",
        "data-bs-target": "#products",
        onClick: () => this.changeModalState(purchase.items)
      }, "Ver productos")), /*#__PURE__*/React.createElement("td", null, purchase.totalPrice), /*#__PURE__*/React.createElement("td", null, purchase.paymentMethod), /*#__PURE__*/React.createElement("td", null, purchase.referenceTransactionNumber), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(PurchaseVerificationStatus, {
        verificationStatus: purchase.verificationStatus,
        customerDni: purchase.customerDni,
        referenceTransactionNumber: purchase.referenceTransactionNumber
      })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(PurchaseDeliveryStatus, {
        deliveryStatus: purchase.deliveryStatus,
        customerDni: purchase.customerDni,
        referenceTransactionNumber: purchase.referenceTransactionNumber
      })));
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