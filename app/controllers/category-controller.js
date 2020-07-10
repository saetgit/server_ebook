const JWT = require("jsonwebtoken");
const db = require("../models/index");
const fs = require("fs");
// const geoip = require("geoip-lite");
// const Sniffr = require("sniffr");
const { Op } = require("sequelize");


module.exports = {
  index: async (req, res) => {
    try {
      let categories = await db.Category.findAll();
      res.json({
        success: true,
        data: categories,
        message: `Category list!`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },
  addCategory: async (req, res) => {
    try {
      let { category } = req.value.body;

      console.log('ooooooooooooooooooooooooooooooooooooooooooooooo',req.value.body);
      // return;
      

      await db.Category.create(
        {
          category,
         
        },
        { fields: ["category"] }
      );

      res.json({
        success: true,
        data: [],
        message: `category registered successfully`
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },

};