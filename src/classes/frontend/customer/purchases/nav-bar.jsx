class NavBar extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a href="/customer/catalogue">Catalogo</a>
          <a href="/customer/purchases">Tus transacciones</a>
          <a href="/customer/account-settings">Configuracion de la cuenta</a>
          <a href="/customer/logout">Salir</a>
        </div>
      </nav>
    )
  }
}