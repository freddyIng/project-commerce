class SearchProduct extends React.Component {
  constructor(props){
    super(props)
    this.state={
      characters: ''
    }
    this.searchProductsInTheList=this.searchProductsInTheList.bind(this)
  }

  async searchProductsInTheList(event){
    await this.setState({characters: event.target.value})
    eventBus.dispatch('searchProducts', {characters: this.state.characters})
  }

  render(){
    return(
      <div id="searchProduct">
        <input value={this.state.characters} onChange={this.searchProductsInTheList} type="search" aria-label="Search" placeholder="Buscar producto"/>
      </div>
    )
  }
}