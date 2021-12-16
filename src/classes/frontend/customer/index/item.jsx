class Item extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div>
        <p>{this.props.productName}</p>
        <p>Cantidad disponible: {this.props.availableQuantity}</p> 
        <p>Precio: {this.props.price}</p>
        <img src={this.props.productPhotoPath}/>
      </div>
    )
  }
}