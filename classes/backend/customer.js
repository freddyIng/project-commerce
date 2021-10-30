//Customer of the commerces
const connectionPoolPath=__dirname.replace('/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
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
  password: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.BIGINT
  }
}, {
     sequelize,
     modelName: 'Customer'}
);

module.exports=Customer;