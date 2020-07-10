'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    family: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    mobile: DataTypes.STRING,
    avatar: DataTypes.STRING,
    type:DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Cart, { foreignKey: 'user_id' });
  };
  return User;
};