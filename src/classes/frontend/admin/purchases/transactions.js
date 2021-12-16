class transactions{
  async getTransactions(){
    let request=await fetch('/admin/purchases/data', {method: 'GET', headers: {'Content-Type': 'application/json'}})
    let response=await request.json()
    if (response.message==='Sucessfull operation'){
      return response.result
    } else{
      alert('Ha ocurrido un error al recuperar sus transacciones. Intentelo de nuevo')
      return []
    }
  }
}