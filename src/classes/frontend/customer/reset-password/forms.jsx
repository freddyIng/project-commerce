class Forms extends React.Component{ //Will render the forms of the responses and the password reset
  constructor(props){
    super(props)
    this.changeDni=this.changeDni.bind(this)
    this.changeFirstPetName=this.changeFirstPetName.bind(this)
    this.changeMotherLastName=this.changeMotherLastName.bind(this)
    this.changeFavoriteDessert=this.changeFavoriteDessert.bind(this)
    this.changePassword=this.changePassword.bind(this)
    this.changePasswordRepeated=this.changePasswordRepeated.bind(this)
    this.sendResponses=this.sendResponses.bind(this)
    this.state={
      dni: '',
      firstPetName: '',
      motherLastName: '',
      favoriteDessert: '',
      password: '',
      passwordRepeated: ''
    }
  }

  changeDni(event){
    this.setState({dni: event.target.value})
  }

  changeFirstPetName(event){
    this.setState({firstPetName: event.target.value})
  }

  changeMotherLastName(Enviar){
    this.setState({motherLastName: event.target.value})
  }

  changeFavoriteDessert(event){
    this.setState({favoriteDessert: event.target.value})
  }

  changePassword(event){
    this.setState({password: event.target.value})
  }

  changePasswordRepeated(event){
    this.setState({passwordRepeated: event.target.value})
  }

  async sendResponses(){
    if (this.state.password===this.state.passwordRepeated){
      let data={
        dni: this.state.dni,
        firstPetName: this.state.firstPetName,
        motherLastName: this.state.motherLastName,
        favoriteDessert: this.state.favoriteDessert,
        password: this.state.password
      }
      data=JSON.stringify(data)
      const request=await fetch('/customer/reset-password', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: data})
      const response=await request.json()
      switch(response.message){
        case 'Ok':
          alert('Tu contraseña ha sido actualizada!')
        break;
        case 'Not ok':
          alert('Los datos que ingresaste son invalidos. Ingresa los datos correctamente')
        break
        case 'Data error':
          alert('Error. La cedula solo debe contener numeros, y la contraseña debe tener entre 6 y 20 caracteres')
        break;
        case 'Error':
          alert('Ha ocurrido un error, intentelo de nuevo')
        break
      }
    } else{
      alert('Las contraseñas no coinciden!')
    }
  }

  render(){
    return (
    <div>
      <h3>Para restablecer tu contraseña, introduce tu cedula, y las respuestas a las preguntas de seguridad.</h3>
      <div className="mb-3">
        <label className="form-label">Cedula</label>
        <input className="form-control" name="dni" value={this.state.dni} onChange={this.changeDni} required/>
      </div>
      <h3>Responde las preguntas de seguridad</h3>
      <div className="mb-3">
         <label className="form-label">¿Cual es el nombre de tu primera mascota?</label>
         <input className="form-control" required name="firstPetName" value={this.state.firstPetName} onChange={this.changeFirstPetName}/>
      </div>
      <div className="mb-3">
        <label className="form-label">¿Cual es el segundo nombre de tu madre?</label>
        <input className="form-control" required name="motherLastName" value={this.state.motherLastName} onChange={this.changeMotherLastName}/>
      </div>
      <div className="mb-3">
        <label className="form-label">¿Cual es tu postre favorito?</label>
        <input className="form-control" required name="favoriteDessert" value={this.state.favoriteDessert} onChange={this.changeFavoriteDessert}/>
      </div>
      <h3>Introduzca su nueva contraseña</h3>
      <div className="mb-3">
        <label className="form-label">Nueva contraseña</label>
        <input className="form-control" type="password" required name="password" value={this.state.password} onChange={this.changePassword}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Repita la nueva contraseña</label>
        <input className="form-control" type="password" required name="passwordRepeated" value={this.state.passwordRepeated} onChange={this.changePasswordRepeated}/>
      </div>
      <button type="submit" className="btn btn-success" onClick={this.sendResponses}>Enviar datos</button>
    </div>
    )
  }
}