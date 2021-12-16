class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("nav", {
      className: "navbar navbar-dark bg-dark"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/admin/inventory"
    }, "Inventario"), /*#__PURE__*/React.createElement("a", {
      href: "/admin/purchases"
    }, "Compras de tus clientes"), /*#__PURE__*/React.createElement("a", {
      href: "/admin/account-settings"
    }, "Configuracion de la cuenta"), /*#__PURE__*/React.createElement("a", {
      href: "/admin/logout"
    }, "Salir")));
  }

}