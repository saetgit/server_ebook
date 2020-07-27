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
  myCart: async (req, res) => {
    try {
      let products = await db.Cart.findAll({
        include: [
          { model: db.User },
          { model: db.Product },
        ],
        where: { user_id: req.user.id, status: "in_buying" }
      });
      res.json({
        success: true,
        data: products,
        message: `Cart list!`
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


  addCart: async (req, res) => {
    try {

      let cart = await db.Cart.create(
        {
          product_id: req.value.body.product_id,
          user_id: req.user.id,
          status: 'in_buying'
        },
        {
          fields: [
            "product_id",
            "user_id",
            "status"
          ]
        }
      );

      res.json({
        success: true,
        data: cart,
        message: `Added`
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },

  deleteFromCart: async (req, res) => {
    try {
      const id = req.params.id;

      let item = db.Cart.destroy({
        where: { product_id: id, status: 'in_buying' }
      })

      if (item) {
        res.json({
          success: true,
          data: true,
          message: `محصول از سبد خرید حذف شد!`
        });
      }


    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again! Error: ${err}`
      });
    }
  },

  destroy: async (req, res) => {
    try {
      const id = req.params.id;

      let basket =await db.Cart.findOne({
        where: { product_id: id, status: 'in_buying' }
      })
      console.log('----------------------------',basket);
      if (!basket) {
        let item = await db.Product.destroy({ where: { id } });

        if (item) {
          res.json({
            success: true,
            data: true,
            message: `Product deleted!`
          });
        }
      } else {
        res.json({
          success: false,
          message: `این محصول در سبد خرید مشتریان وجود دارد `
        });
      }


    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again! Error: ${err}`
      });
    }
  },
  show: async (req, res) => {
    try {
      const id = req.params.id;
      let item = await db.Product.findOne({ where: { id:id } });
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
  orderd: async (req, res) => {
    try {
      console.log('=================================', req.user);

      await db.Cart.update(
        { status: 'buyed' },
        { where: { user_id: req.user.id } }
      );

      res.json({
        success: true,
        message: `سفارش شما با موفقیت انجام شد!`
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again! ERROR:${err}`
      });
    }
  },
  orders: async (req, res) => {
    try {
      let Products = await db.Cart.findAll({
        where: { status: 'buyed' },
        include: [
          { model: db.User },
          { model: db.Product },
        ],
      });
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
  deleteFromOrder: async (req, res) => {
    try {
      const id = req.params.id;

      let basket =await db.Cart.findOne({
        where: { product_id: id, status: 'buyed' }
      })
      console.log('----------------------------',basket);
      if (!basket) {
        let item = await db.Cart.destroy({ where: { id } });

        if (item) {
          res.json({
            success: true,
            data: true,
            message: `Product deleted!`
          });
        }
      } else {
        res.json({
          success: false,
          message: `این محصول در سبد خرید مشتریان وجود دارد `
        });
      }


    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again! Error: ${err}`
      });
    }
  },
  ordersProduct: async (req, res) => {
    try {
      const id = req.params.id;
      console.log('============>',id);
      console.log('=================================', req.user.id);
      let Products = await db.Cart.findAll({
        where: {user_id:  req.user.id, status: 'buyed' },
        include: [
          { model: db.User },
          { model: db.Product },
        ],
      });
      res.json({
        success: true,
        data: Products,
        message: `Products list!`,
        
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },
};