class catalogue{

  constructor(idContainer, commerceName){
    this.idContainer=idContainer;
  }

  async getProducts(){
  	try{
  	  let request=await fetch();
      let response=await request.json();
      return response;
  	} catch(err){
      return 'Error';
  	}
  }

}