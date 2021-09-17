class shoppingCart{
  constructor(){
    this.items=[]; /*Sera una lista de objetos, donde cada objeto representara el producto, y cuyos atributos seran el nombre/descripcion
    del producto, la cantidad, y el precio*/
  }
  addItem(item){
  	//Primero, verifico si el producto ya existe en el carito. Caso afirmativo, se aumentara la cantidad en +1 de ese producto
  	let flag=false, position;
  	for (let i=0; i<this.items.length; i++){
  	  if (this.items[i].description===item.description){
  	    flag=true;
  	    position=i; //guardo la posicion de ese producto para luego actualizar su cantidad.
  	  }
  	}
  	if (!flag){
  	  this.items.push({description: item.description, price: item.price, imagePath: item.imagePath, amount: 1});
  	} else{
      this.items[position].amount+=1;
  	}
  }

  async buy(products, idUser, bank, referenceNumber, date){
    let purchaseData={
      items: products,
      idUser: idUser,
      bank: bank,
      referenceNumber: referenceNumber,
      date: date
    };
    let request=await fetch('/buy', {method: 'post', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(purchaseData)});
    let response=await request.json();
    if (response.message==='Compra exitosa'){
      alert(response.code);
    } else{
      alert('Ha ocurrido un error en su transaccion, intentelo de nuevo!');
    }
  }

  getItems(){
    return this.items;
  }
}