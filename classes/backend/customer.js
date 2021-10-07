//Customer of the commerces
const dbConnector=require('./connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Customer extends Model{};
Customer.init({
  name: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  dni: {
    type: DataTypes.INTEGER
  },
  email: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.BIGINT
  }
});

module.exports=Customer;