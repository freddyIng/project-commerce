  class AddProductForm extends React.Component{
    constructor(props){
      super(props)
      this.fileInput=React.createRef()
      this.state={
        name: '',
        availableQuantity: '',
        price: ''
      }
      this.changeProductName=this.changeProductName.bind(this)
      this.changeProductAvailableQuantity=this.changeProductAvailableQuantity.bind(this)
      this.changeProductPrice=this.changeProductPrice.bind(this)
      this.sendData=this.sendData.bind(this)
    }

    changeProductName(event){
      this.setState({name: event.target.value})
    }

    changeProductAvailableQuantity(event){
      this.setState({availableQuantity : event.target.value})
    }

    changeProductPrice(event){
      this.setState({price : event.target.value})
    }

    async sendData(){
      if (this.state.name==='' || this.state.availableQuantity===''
      || this.state.price==='' || this.fileInput.current.files[0].name===''){
        alert('Todos los campos son requeridos al momento de agregar un producto! Por favor, llene los campos campos correspondientes,incluida la carga de la correspondiente foto del producto.')
        return
      }
      let data={
        productName: this.state.name,
        amount: this.state.availableQuantity,
        price: this.state.price,
      }
      let request=await fetch('/admin/add-product/data', {method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)})
      let response=await request.json()
      if (response.message==='Sucessfull operation'){
        let photo=new FormData()
        photo.append('productPhoto', this.fileInput.current.files[0])
        photo.append('productName', this.state.name)
        request=await fetch('/admin/add-product/photo', {method: 'POST', body: photo})
        response=await request.json()
        if (response.message==='Sucessfull operation'){
          /*Apart from change the state of the inputs of the forms (and the file), the event that render the new item in the list
          of products is fired*/
          let data={
            productName: this.state.name,
            availableQuantity: this.state.availableQuantity,
            price: this.state.price,
            productPhotoPath: response.photoPath
          }
          eventBus.dispatch('addItemToTheList', data)
          alert('Se ha agregado el producto con exito!')
          this.setState({
            name: '',
            availableQuantity: '',
            price: ''
          })
          //I guess this will cause problems, because is neither a state or a prop, so I'm not sure if can be changed
          //this.fileInput=React.createRef() 
        } else{
          alert(response.message)
        }
      } else{
        alert('Ha ocurrido un error al agregar el producto!');
      }
    }


    /*So I make double fetch petition. The first with the data of the new product, with content type application/json,
  and the second with the photo of the producto, with content type mulfipart/form-data*/

    render(){
      return (
        <div>
          <div className="mb-3">
          <p>Descripcion/Nombre del producto:</p>
        <input type="text" value={this.state.name} onChange={this.changeProductName} name="a"/>
        </div>
        <div className="mb-3">
          <p>Cantidad disponbile:</p>
          <input type="number" value={this.state.availableQuantity} onChange={this.changeProductAvailableQuantity} name="c"/>
        </div>
        <div className="mb-3">
          <p>Precio:</p>
            <input type="number" value={this.state.price} onChange={this.changeProductPrice} name="d"/>
        </div>
        <label className="form-label">Imagen/Foto del producto: </label>
        <input type="file" ref={this.fileInput} name="e"/>
        <button className="btn btn-success" onClick={this.sendData} name="f">Agregar Producto</button>
        </div>
      )
    }
  }