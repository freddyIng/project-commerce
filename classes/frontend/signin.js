class signin{

  validateData(){

  }

  async sendData(data){
    let request=await fetch();
    let response=await request.json();
    if (request.result==='Operacion exitosa'){
      alert('Te has registrado con exito! Ahora puedes inciar sesion para empezar a administrar tu negocio online!');
    } else{
      alert('Ha ocurrido un error. Intentelo de nuevo');
    }
  }
}