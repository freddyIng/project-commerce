class paymentInformation{
  constructor(){
    this.data=[]
  }

  async getData(){
    let request=await fetch('/customer/catalogue/payment-information', {method: 'GET', headers: 
      {'Content-Type': 'application/json'}})
    let response=await request.json()
    if (response.message==='Sucessfull operation'){
      this.data=response.result[0].paymentInformation //This is not a string... is a object, so, JSON.parse is innecesary
    }
    return this.data
  }
}