class paymentInformation {
  constructor() {
    this.data = [];
  }

  async getData() {
    let request = await fetch('/customer/catalogue/payment-information', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let response = await request.json();

    if (response.message === 'Sucessfull operation') {
      /*Because not necessary some commerce use all the payment methods, I will filter what methods are use knowing the value
      of the referenceNumber. If is '', then is not used*/
      let paymentMethodsData = response.result[0].paymentInformation; //This is not a string... is a object, so, JSON.parse is innecesary

      paymentMethodsData.forEach(method => {
        if (method.referenceNumber !== '') {
          this.data.push(method);
        }
      });
    }

    return this.data;
  }

}