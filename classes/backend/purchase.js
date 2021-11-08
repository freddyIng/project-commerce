const connectionPoolPath=__dirname.replace('/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Purchase extends Model {};
Purchase.init({
  commerceName: {
    type: DataTypes.STRING
  },
  customerDni: {
    type: DataTypes.INTEGER
  },
  items: {
    type: DataTypes.ARRAY(DataTypes.JSON)
  },
  buyerData:{
    type: DataTypes.JSON
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  referenceTransactionNumber: {
    type: DataTypes.BIGINT
  },
}, {
  sequelize,
  modelName: 'Purchase'
});

module.exports=Purchase;
