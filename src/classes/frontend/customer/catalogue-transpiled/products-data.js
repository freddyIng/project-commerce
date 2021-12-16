class productsData {
  async getProducts() {
    let request = await fetch('/customer/catalogue/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let response = await request.json();
    return {
      products: response.result
    };
  }

}