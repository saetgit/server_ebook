'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  Cart.associate = function(models) {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.belongsTo(models.Product, { foreignKey: 'product_id' });
  };
  return Cart;
};