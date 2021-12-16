class NavBar extends React.Component{
  
  constructor(props){
    super(props)
  }

  render(){
    return (
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a href="/admin/inventory">Inventario</a>
            <a href="/admin/purchases">Compras de tus clientes</a>
            <a href="/admin/account-settings">Configuracion de la cuenta</a>
            <a href="/admin/logout">Salir</a>
          </div>
        </nav>
    )
  }
}