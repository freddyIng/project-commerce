const connectionPoolPath=__dirname.replace('/src/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Admin extends Model {};
Admin.init({
  username: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  paymentInformation: {
    type: DataTypes.ARRAY(DataTypes.JSONB)
  }
}, {
  timestamps: false,
  sequelize,
  modelName: 'admin'
});

module.exports=Admin;