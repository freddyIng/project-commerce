(async function app() {
  let transactionsObject = new transactions();
  const navBar = /*#__PURE__*/React.createElement(NavBar, null);
  const purchasesTable = /*#__PURE__*/React.createElement(TableAdmin, {
    purchases: await transactionsObject.getTransactions()
  });
  ReactDOM.render( /*#__PURE__*/React.createElement("div", null, navBar, purchasesTable), document.getElementById('root'));
})();