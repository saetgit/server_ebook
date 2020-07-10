const JWT = require("jsonwebtoken");
const db = require("../models/index");
const fs = require("fs");
// const geoip = require("geoip-lite");
// const Sniffr = require("sniffr");
const { Op } = require("sequelize");


module.exports = {
  index: async (req, res) => {
    try {
      let Products = await db.Product.findAll();
      res.json({
        success: true,
        data: Products,
        message: `Products list!`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },
  addProduct: async (req, res) => {
    try {
      let { Title, discription, auther, discount, rate, price, colorClass } = req.value.body;

      console.log('ooooooooooooooooooooooooooooooooooooooooooooooo',req.value.body);
      // return;
      

      await db.Product.create(
        {
          Title,
          discription,
          auther,
          discount,
          rate,
          price,
          colorClass
        },
        { fields: ["Title", "discription", "auther", "discount", "rate", "price", "colorClass"] }
      );

      res.json({
        success: true,
        data: [],
        message: `Product registered successfully`
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },

};