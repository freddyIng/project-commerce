//This code create the tables in postgresql with sequelize
require('dotenv').config();
const {Sequelize}=require('sequelize');
sequelize=new Sequelize(process.env.DB_DATABASE, process.env.DB_user, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  quoteIdentifiers: false,
  freezeTableName: true,
});

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

class Stock extends Model{};
Stock.init({
  productName: {
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
  timestamps: false,
  sequelize,
  modelName: 'stock'
});

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


(async ()=>{
  try {
    await sequelize.authenticate();
    await Admin.sync();
    await Stock.sync();
    await Admin.sync();
    await Customer.sync();
    await Purchase.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally{
    await sequelize.close();
  }
})();
