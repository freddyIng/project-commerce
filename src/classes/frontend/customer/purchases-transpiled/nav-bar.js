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
      href: "/customer/catalogue"
    }, "Catalogo"), /*#__PURE__*/React.createElement("a", {
      href: "/customer/purchases"
    }, "Tus transacciones"), /*#__PURE__*/React.createElement("a", {
      href: "/customer/account-settings"
    }, "Configuracion de la cuenta"), /*#__PURE__*/React.createElement("a", {
      href: "/customer/logout"
    }, "Salir")));
  }

}