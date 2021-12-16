class Grid extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className="grid-container">
        {this.props.products.map(product=>{
          return <Item key={product.productName}
            productName={product.productName}
            availableQuantity={product.availableQuantity}
            price={product.price}
            productPhotoPath={product.productPhotoPath}
        />})}
      </div>
    )
  }
}