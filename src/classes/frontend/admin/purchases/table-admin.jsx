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
              	  let remainingVerificationStatus=[]
              	  switch(purchase.verificationStatus){
              	    case 'Pendiente':
              	      remainingVerificationStatus.push('Validada')
              	      remainingVerificationStatus.push('Invalidada')
              	    break;
              	    case 'Validada':
              	      remainingVerificationStatus.push('Invalidada')
              	      remainingVerificationStatus.push('Pendiente')
              	    break;
              	    case 'Invalidada':
              	      remainingVerificationStatus.push('Validada')
              	      remainingVerificationStatus.push('Pendiente')
              	  }
                  return <tr key={purchase.referenceTransactionNumber}>
                           <td>{purchase.customerDni}</td>
                            <td>
                              <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#products" onClick={()=>this.changeModalState(purchase.items)}>Ver productos</button>
                           </td>
                           <td>{purchase.totalPrice}</td><td>{purchase.paymentMethod}</td>
                           <td>{purchase.referenceTransactionNumber}</td>
                           <td>
                           	 <select className="form-select" onChange={(e)=>this.changeTransactionStatus(e, true, purchase.customerDni, purchase.referenceTransactionNumber)}>
                               <option value={purchase.verificationStatus}>{purchase.verificationStatus}</option>
                               <option value={remainingVerificationStatus[0]}>{remainingVerificationStatus[0]}</option>
                               <option value={remainingVerificationStatus[1]}>{remainingVerificationStatus[1]}</option>
                             </select>
                           </td>
                           <td>
                             <select className="form-select" onChange={(e)=>this.changeTransactionStatus(e, false, purchase.customerDni, purchase.referenceTransactionNumber)}>
                                <option value={purchase.deliveryStatus? 'Si' : 'No'}>{purchase.deliveryStatus? 'Si' : 'No'}</option>
                                <option value={purchase.deliveryStatus? 'No' : 'Si'}>{purchase.deliveryStatus? 'No' : 'Si'}</option>
                              </select>
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