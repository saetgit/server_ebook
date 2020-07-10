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
      let { Title, description, auther, discount, img, rate, price, colorClass } = req.value.body;
      let category_id = colorClass;

      // console.log(req.value.body);
      // return;


      await db.Product.create(
        {
          Title,
          description,
          auther,
          discount,
          rate,
          img: img.filename,
          price,
          category_id
        },
        {
          fields: [
            "Title",
            "description",
            "auther",
            "discount",
            "rate",
            "img",
            "price",
            "category_id"
          ]
        }
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

  destroy: async (req, res) => {
    try {
      const id = req.params.id;

      let item = await db.Product.destroy({ where: { id } });

      if (item) {
        res.json({
          success: true,
          data: true,
          message: `Product deleted!`
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again!`
      });
    }
  },
  show: async (req, res) => {
    try {
      const id = req.params.id;
      let item = await db.Product.findOne({ where: { id } });
      if (item) {
        res.json({
          success: true,
          data: item,
          message: `Product !`
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },
};