//Customer of the commerces
const connectionPoolPath=__dirname.replace('/classes/backend', '');
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
  }
}, {
     timestamps: false,
     sequelize,
     modelName: 'customer'}
);

module.exports=Customer;