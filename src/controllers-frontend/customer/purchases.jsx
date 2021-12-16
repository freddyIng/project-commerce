(async function app(){
  let transactionsObject=new transactions()
  const navBar=<NavBar />
  const purchasesTable=<Table purchases={await transactionsObject.getTransactions()} />
  ReactDOM.render(
    <div>
      {navBar}
      {purchasesTable}
    </div>,
    document.getElementById('root')
  )
})()

