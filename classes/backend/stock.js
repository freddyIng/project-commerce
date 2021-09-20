/*This class It will be related to the catalog class of the user interface. The catalog class will 
be in charge of ordering the products of the stock class to be displayed on the screen*/
const connectionPoolPath=__dirname.replace('/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Stock extends Model{};
Stock.init({
  commerceName: {
    type: DataTypes.STRING
  },
  productName: {
    type: DataTypes.STRING
  },
  classification: {
    type: DataTypes.STRING
  },
  availableQuantity: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.FLOAT
  },
  productPhotoPath: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Stock'
});

module.exports=Stock;