const dbConnector=require('./connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Purchase extends Model {
}:
Purchase.init({
  commerceName: {
    type: DataTypes.STRING
  },
  items: {
    type: DataTypes.ARRAY(DataTypes.JSON)
  },
  buyerData:{
    type: DataTypes.JSON
  }
  referenceTransactionNumber: {
    type: DataTypes.INTEGER
  },
}, {
  sequelize,
  modelName: 'Purchase'
});

module.exports=Purchase;
