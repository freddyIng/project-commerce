function textContainer(propertyName, value) {
  return /*#__PURE__*/React.createElement("p", null, " ", propertyName, " : ", value, " ");
}

function inputContainer(propertyName, value, stateName, changeStateEvent) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, propertyName), /*#__PURE__*/React.createElement("input", {
    type: "text",
    defaultValue: value,
    name: stateName,
    onChange: changeStateEvent
  }));
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.confirmUpdate = this.confirmUpdate.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
    /*The src of the img of the product will not cotain container. And the buttons state will change between "normal" to 
    update (will be a jsx consist of pair of buttons, one pair for update and delete, and the other for confir or cancel the update*/

    this.state = {
      availableQuantityContainer: this.props.availableQuantityContainer,
      availableQuantity: this.props.availableQuantity,
      inputAvailableQuantity: this.props.availableQuantity,
      priceContainer: this.props.priceContainer,
      price: this.props.price,
      inputPrice: this.props.price,
      src: this.props.src,
      buttonsState: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        onClick: this.update
      }, "Actualizar"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-danger",
        onClick: this.delete
      }, "Eliminar")),
      isDeleted: false //Initial value for conditional rendering

    };
  }

  update() {
    this.setState({
      availableQuantityContainer: inputContainer('Cantidad disponible', this.state.availableQuantity, 'inputAvailableQuantity', this.handleInputChange),
      priceContainer: inputContainer('Precio', this.state.price, 'inputPrice', this.handleInputChange),
      buttonsState: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-success",
        onClick: this.confirmUpdate
      }, "Confirmar actualizacion"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: this.cancelUpdate
      }, "Cancelar"))
    });
  }

  async handleInputChange(event) {
    //Async because the setState function is asyncronous.
    const stateName = event.target.name,
          newValue = event.target.value;
    await this.setState({
      [stateName]: newValue
    });
  }

  async confirmUpdate() {
    let request = await fetch('/admin/update-product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productName: this.props.name,
        availableQuantity: this.state.inputAvailableQuantity,
        price: this.state.inputPrice
      })
    });
    let response = await request.json();

    if (response.result === 'Operacion exitosa!') {
      this.setState({
        name: this.state.inputName,
        availableQuantity: this.state.inputAvailableQuantity,
        price: this.state.inputPrice
      });
      this.setState({
        availableQuantityContainer: textContainer('Cantidad disponible', this.state.availableQuantity),
        priceContainer: textContainer('Precio', this.state.price),
        buttonsState: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          className: "btn btn-primary",
          onClick: this.update
        }, "Actualizar"), /*#__PURE__*/React.createElement("button", {
          className: "btn btn-danger",
          onClick: this.delete
        }, "Eliminar"))
      });
      alert('Se han actualizado los datos del producto con exito!');
    } else {
      alert('Ha ocurrido un error al actualizar los datos. Intentelo de nuevo. Si el problema persiste, comuniquese con nosotros');
    }
  }

  cancelUpdate() {
    //Apart from update the containers, I clean the values of the inputs, and return to the actual states 
    this.setState({
      availableQuantityContainer: textContainer('Cantidad disponible', this.state.availableQuantity),
      inputAvailableQuantity: this.state.availableQuantity,
      priceContainer: textContainer('Precio', this.state.price),
      inputPrice: this.state.price,
      buttonsState: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        onClick: this.update
      }, "Actualizar"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-danger",
        onClick: this.delete
      }, "Eliminar"))
    });
  }

  async delete() {
    console.log(this.state.src);
    let request = await fetch('/admin/delete-product', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productName: this.props.name,
        photoPath: this.state.src
      })
    });
    let response = await request.json();

    if (response.result === 'El producto ha sido eliminado!') {
      alert('El producto ha sido eliminado!');
      this.setState({
        isDeleted: true
      });
    } else {
      alert('Error. Try again!');
    }
  }

  render() {
    let item = /*#__PURE__*/React.createElement("li", {
      className: "list-group-item"
    }, " ", /*#__PURE__*/React.createElement("div", null, this.props.name, this.state.availableQuantityContainer, this.state.priceContainer, /*#__PURE__*/React.createElement("img", {
      src: this.state.src,
      alt: "product photo"
    }), this.state.buttonsState), " ");
    return this.state.isDeleted ? /*#__PURE__*/React.createElement("div", null) : item;
  }

}