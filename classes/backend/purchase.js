const connectionPoolPath=__dirname.replace('/classes/backend', '');
const dbConnector=require(connectionPoolPath+'/connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Purchase extends Model {};
Purchase.init({
  customerDni: {
    type: DataTypes.INTEGER
  },
  items: {
    type: DataTypes.ARRAY(DataTypes.JSON)
  },
  totalPrice: {
    type: DataTypes.FLOAT
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  referenceTransactionNumber: {
    type: DataTypes.BIGINT
  },
  verificationStatus: {
    type: DataTypes.ENUM('Pendiente', 'Validada', 'Invalidada')
  },
  deliveryStatus: {
    type: DataTypes.BOOLEAN //False for not delivered, true otherwise
  },
  viewByAdministrator: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  modelName: 'purchase'
});

module.exports=Purchase;
