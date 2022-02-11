//Customer of the commerces
const connectionPoolPath=__dirname.replace('/src/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Customer extends Model{};
Customer.init({
  dni: {
    type: DataTypes.INTEGER
  },
  password: {
    type: DataTypes.STRING
  },
  //answers to security questions
  firstPetName: {
  	type: DataTypes.STRING
  },
  motherLastName: {
  	type: DataTypes.STRING
  },
  favoriteDessert: {
  	type: DataTypes.STRING
  }
}, {
     timestamps: false,
     sequelize,
     modelName: 'customer'}
);

module.exports=Customer;