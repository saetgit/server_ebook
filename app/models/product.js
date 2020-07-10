'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    Title: DataTypes.STRING,
    description: DataTypes.STRING,
    auther: DataTypes.STRING,
    discount: DataTypes.STRING,
    rate: DataTypes.STRING,
    price: DataTypes.STRING,
    colorClass: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};