'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    Title: DataTypes.STRING,
    description: DataTypes.STRING,
    auther: DataTypes.STRING,
    discount: DataTypes.STRING,
    rate: DataTypes.STRING,
    price: DataTypes.STRING,
    img: DataTypes.STRING,
    colorClass: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    Product.hasMany(models.Cart, { foreignKey: 'product_id' });
  };
  return Product;
};