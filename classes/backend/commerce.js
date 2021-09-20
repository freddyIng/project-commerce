const connectionPoolPath=__dirname.replace('/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Commerce extends Model {};
Commerce.init({
  commerceName: {
    type: DataTypes.STRING
  },
  descriptionOfTheCommerce: {
    type: DataTypes.STRING
  },
  email:{
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.BIGINT
  },
  password: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  direction: {
    type: DataTypes.STRING
  },
  commercePhotoPath: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Commerce'
});

module.exports=Commerce;