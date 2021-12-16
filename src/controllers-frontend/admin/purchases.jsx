(async function app(){
  let transactionsObject=new transactions()
  const navBar=<NavBar />
  const purchasesTable=<TableAdmin purchases={await transactionsObject.getTransactions()} />
  ReactDOM.render(
    <div>
      {navBar}
      {purchasesTable}
    </div>,
    document.getElementById('root')
  )
})()