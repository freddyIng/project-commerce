  class PurchaseVerificationStatus extends React.Component{

    constructor(props){
      super(props)
      this.state={
        viewState: this.props.verificationStatus,
        selectValue: this.props.verificationStatus
      }
      this.changeTransactionVerificationStatus=this.changeTransactionVerificationStatus.bind(this)
    }

    async changeTransactionVerificationStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber){
      if (window.confirm('Estas seguro de cambiar el estado de la transaccion? Esta accion es irreversible!')){
      	this.setState({
      	  selectValue: event.target.value
      	})
        const status=verificationOrDelivery? 'verification-status' : 'delivery-status'
  	    let data={
  	      newState: event.target.value,
  	      dni: customerDni,
  	      transactionNumber: referenceTransactionNumber
  	    }
  	    data=JSON.stringify(data)
        let request=await fetch(`/admin/purchases/change/${status}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: data})
        let response=await request.json()
        if (response.message==='Sucessfull operation'){
          socket.emit('change status purchase', {dni: customerDni, statusType: verificationOrDelivery? 'Verificacion' : 'Entrega', state: event.target.value, referenceNumber: referenceTransactionNumber})
          this.setState({
            viewState: data.newState
          })
          alert('El estado de la transaccion ha sido cambiado con exito!')
        } else{
          this.setState({
      	    selectValue: 'Pendiente'
      	  })
          alert('Ha ocurrido un error. Intentelo de nuevo')
        }
      } else{
      	/*I return the previous value of the select element to the default (pendiente). Is enough to change the state again
      	to "Pendiente" */
      	this.setState({
      	  selectValue: 'Pendiente'
      	})
      }
    }

    render(){
      return (
        this.state.viewState==='Pendiente'? 
             <select value={this.state.selectValue} className="form-select" onChange={(e)=>this.changeTransactionVerificationStatus(e, true, this.props.customerDni, this.props.referenceTransactionNumber)}>
               <option value={'Pendiente'}>{'Pendiente'}</option>
               <option value={'Validada'}>{'Validada'}</option>
               <option value={'Invalidada'}>{'Invalidada'}</option>
             </select>
                :
             <p>{this.state.selectValue}</p>
      )
    }

  }

  class PurchaseDeliveryStatus extends React.Component{

    constructor(props){
      super(props)
      this.state={
        viewState: this.props.deliveryStatus? 'Si' : 'No',
        selectValue: this.props.deliveryStatus? 'Si' : 'No'
      }
      this.changeTransactionDeliveryStatus=this.changeTransactionDeliveryStatus.bind(this)
    }

    async changeTransactionDeliveryStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber){
      if (window.confirm('Estas seguro de cambiar el estado de la transaccion? Esta accion es irreversible!')){
      	this.setState({
      	  selectValue: event.target.value
      	})
        const status=verificationOrDelivery? 'verification-status' : 'delivery-status'
  	    let data={
  	      newState: event.target.value,
  	      dni: customerDni,
  	      transactionNumber: referenceTransactionNumber
  	    }
  	    data=JSON.stringify(data)
        let request=await fetch(`/admin/purchases/change/${status}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: data})
        let response=await request.json()
        if (response.message==='Sucessfull operation'){
          socket.emit('change status purchase', {dni: customerDni, statusType: verificationOrDelivery? 'Verificacion' : 'Entrega', state: event.target.value, referenceNumber: referenceTransactionNumber})
          this.setState({
            viewState: 'Si'
          })
          alert('El estado de la transaccion ha sido cambiado con exito!')
        } else{
          alert('Ha ocurrido un error. Intentelo de nuevo')
          this.setState({
      	    selectValue: 'No'
          })
        }
      }
    }

    render(){
      return (
        this.state.viewState==='No'? 
            <select value={this.state.selectValue} className="form-select" onChange={(e)=>this.changeTransactionDeliveryStatus(e, false, this.props.customerDni, this.props.referenceTransactionNumber)}>
              <option value={'No'}>{'No'}</option>
              <option value={'Si'}>{'Si'}</option>
            </select>
                :
            <p>{this.state.selectValue}</p>
      )
    }

  }


  class TableAdmin extends React.Component{
  constructor(props){
    super(props)
    this.state={
      purchases: this.props.purchases,
      itemsModal: []
    }
    this.changeModalState=this.changeModalState.bind(this)
    this.changeTransactionStatus=this.changeTransactionStatus.bind(this)
  }

  componentDidMount(){
    socket.on('new purchase', data => {
      alert('Tienes una nueva compra!');
      //I update the state with the new purchase. And I put in the beginning of the array, so, will render as the first.
      let newPurchasesState=this.state.purchases
      newPurchasesState.unshift(data)
      this.setState({
        purchases: newPurchasesState
      })
      //Next, I update the state of view by the admin in the database making a request.
      fetch('/admin/purchases/change/view-by-admin-status', {method: 'PUT'})
    })
  }

  changeModalState(items){
    this.setState({
      itemsModal: items
    })
  }


  async changeTransactionStatus(event, verificationOrDelivery, customerDni, referenceTransactionNumber){
  	const status=verificationOrDelivery? 'verification-status' : 'delivery-status'
  	let data={
  	  newState: event.target.value,
  	  dni: customerDni,
  	  transactionNumber: referenceTransactionNumber
  	}
  	data=JSON.stringify(data)
    let request=await fetch(`/admin/purchases/change/${status}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: data})
    let response=await request.json()
    if (response.message==='Sucessfull operation'){
      socket.emit('change status purchase', {dni: customerDni, statusType: verificationOrDelivery? 'Verificacion' : 'Entrega', state: event.target.value, referenceNumber: referenceTransactionNumber})
      alert('El estado de la transaccion ha sido cambiado con exito!')
    } else{
      alert('Ha ocurrido un error. Intentelo de nuevo')
    }
  }

  render(){
    return (
      <div>

          <table className="table">
            <thead>
              <tr>
                <th>Cedula del comprador</th>
                <th>Productos</th>
                <th>Precio total</th>
                <th>Metodo de pago</th>
                <th>Numero de referencia de la transaccion</th>
                <th>Estado de la transaccion</th>
                <th>Pedido entregado</th>
              </tr>
            </thead>
            <tbody>
              {this.state.purchases.map(purchase=>{
                  return <tr key={purchase.referenceTransactionNumber}>
                           <td>{purchase.customerDni}</td>
                            <td>
                              <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#products" onClick={()=>this.changeModalState(purchase.items)}>Ver productos</button>
                           </td>
                           <td>{purchase.totalPrice}</td><td>{purchase.paymentMethod}</td>
                           <td>{purchase.referenceTransactionNumber}</td>
                           <td>
                             <PurchaseVerificationStatus verificationStatus={purchase.verificationStatus} 
                             customerDni={purchase.customerDni} referenceTransactionNumber={purchase.referenceTransactionNumber}/>
                           </td>
                           <td>
                             <PurchaseDeliveryStatus deliveryStatus={purchase.deliveryStatus} 
                             customerDni={purchase.customerDni} referenceTransactionNumber={purchase.referenceTransactionNumber}/>
                            </td>
                         </tr>
              })}
            </tbody>
          </table>



          <div className="modal fade" id="products" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Productos que compro el cliente</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th><th>Cantidad</th><th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {this.state.itemsModal.map(item=>{
                  return <tr key={item.name}>
                           <td>{item.name}</td><td>{item.amount}</td><td>{item.price}</td>
                         </tr>
                })}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
          </div>
          </div>
          </div>
          </div>


        </div>
    )
  }
}