    class Table extends React.Component{
      constructor(props){
        super(props)
        this.state={
          purchases: this.props.purchases,
          itemsModal: []
        }
        this.changeModalState=this.changeModalState.bind(this)
      }

      changeModalState(items){
        this.setState({
          itemsModal: items
        })
      }

      componentDidMount(){
        socket.on('change status purchase', data => {
          let newStatePurchases=this.state.purchases
          let i=0, flag=false, purchaseIndex=-1
          while (i<this.state.purchases.length && !flag){
            if (this.state.purchases[i].referenceTransactionNumber===data.referenceNumber){
              flag=true
              purchaseIndex=i
            }
            i++
          }
          if (data.statusType==='Verificacion'){
            newStatePurchases[purchaseIndex].verificationStatus=data.state
          } else if (data.statusType==='Entrega'){
            newStatePurchases[purchaseIndex].deliveryStatus=data.state==='Si'? true : false
          } 
          this.setState({
            purchases: newStatePurchases
          })
          alert('El estado de tu compra ha cambiado!')
        })
      }

      render(){
        return (
         <div>

          <table className="table">
            <thead>
              <tr>
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
                            <td>
                              <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#products" onClick={()=>this.changeModalState(purchase.items)}>Ver productos</button>
                           </td>
                           <td>{purchase.totalPrice}</td><td>{purchase.paymentMethod}</td>
                           <td>{purchase.referenceTransactionNumber}</td>
                           <td>{purchase.verificationStatus}</td>
                           <td>{purchase.deliveryStatus? 'Si' : 'No'}</td>
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