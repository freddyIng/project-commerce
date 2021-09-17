const dbConnector=require('./connection-pool.js');
const sequelize=dbConnector.getPool();
const {DataTypes, Model}=require('sequelize');

class Employee extends Model {
}:
Employee.init({
  commerceName: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  lastName:{
    type: DataTypes.STRING
  }
  salary: {
    type: DataTypes.FLOAT
  },
  schedule: {
    type: DataTypes.ARRAY(DataTypes.JSON) //Each json will include: The day (monday, tuesday, etc) and the range time (7:00-15:00, etc)
  },
  payDay: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'Employee'
});

module.exports=Employee;
