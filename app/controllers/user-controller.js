const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models/index");
const fs = require("fs");
// const geoip = require("geoip-lite");
// const Sniffr = require("sniffr");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    try {
      let users = await db.User.findAll({ where: { type: 'user' } });
      res.json({
        success: true,
        data: users,
        message: `Users list!`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },

  signUp: async (req, res) => {
    try {

      let {
        email,
        username,
        password,
        name,
        family,
        address,
        website,
        mobile,
        phone,
        avatar,
      } = req.value.body;

      let type = 'user';

      let user = await db.User.findOne({
        where: { username }
      });

      if (!user) {
        let userWithEmail = await db.User.findOne({
          where: { email }
        });

        if (!userWithEmail) {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const passwprdHash = await bcrypt.hash(password, salt);

          let newUser = await db.User.create(
            {
              email,
              username,
              password: passwprdHash,
              name,
              family,
              address,
              website,
              mobile,
              phone,
              avatar,
              type
            },
            {
              fields: [
                "email",
                "username",
                "password",
                "name",
                "family",
                "address",
                "website",
                "mobile",
                "phone",
                "avatar",
                "type",
              ]
            }
          );

          if (newUser) {
            res.json({
              success: true,
              data: newUser,
              message: `User registered successfully!`
            });
          }
        } else {
          res.status(409).json({
            success: false,
            message: `Error, Email already exist!`
          });
        }
      } else {
        res.status(409).json({
          success: false,
          message: `Error, Username already exist!`
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },

  signIn: async (req, res) => {
    try {
      // Generate the token
      const token = JWT.sign(
        {
          type: "user",
          data: req.user
        },
        process.env.SECRET,
        {
          expiresIn: 604800 // for 1 week timein milliseconds
        }
      );

      res.status(200).json({
        success: true,
        token: token,
        message: "User logged in successfully.",
        user: req.user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error,
        message: `Error on server, Please try again! Error:${error}`
      });
    }
  },


  // signIn: async (req, res) => {
  //   try {
  //     const ip = "83.123.69.249";
  //     // const ip = req.ip;

  //     const s = new Sniffr();
  //     s.sniff(req.headers["user-agent"]);

  //     const os = s.os.name ? s.os.name : "Unknown";
  //     const browser = s.browser.name ? s.browser.name : "Unknown";
  //     const device = s.device.name ? s.device.name : "Unknown";

  //     const geo = await geoip.lookup(ip);

  //     const country = geo.country ? geo.country : "Unknown";
  //     const region = geo.region ? geo.region : "Unknown";
  //     const timezone = geo.timezone ? geo.timezone : "Unknown";
  //     const city = geo.city ? geo.city : "Unknown";
  //     const ll = geo.ll ? geo.ll : "Unknown";

  //     let newSession = await db.Session.create(
  //       {
  //         ip,
  //         os,
  //         browser,
  //         device,
  //         country,
  //         region,
  //         timezone,
  //         city,
  //         ll: ll.join(),
  //         user_id: req.user.id
  //       },
  //       {
  //         fields: [
  //           "ip",
  //           "os",
  //           "browser",
  //           "device",
  //           "country",
  //           "region",
  //           "timezone",
  //           "city",
  //           "ll",
  //           "user_id"
  //         ]
  //       }
  //     );

  //     req.user.session = newSession;

  //     // Generate the token
  //     const token = JWT.sign(
  //       {
  //         type: "user",
  //         data: req.user
  //       },
  //       process.env.SECRET,
  //       {
  //         expiresIn: 604800 // for 1 week timein milliseconds
  //       }
  //     );

  //     res.status(200).json({
  //       success: true,
  //       token: token,
  //       message: "User logged in successfully.",
  //       user: req.user
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error,
  //       message: `Error on server, Please try again! Error:${error}`
  //     });
  //   }
  // },
  me: async (req, res) => {
    let user = await req.user;
    delete user.dataValues.password;

    res.json({
      success: true,
      user: user,
      message: ``
    });
  },

  logout: async (req, res) => {
    res.json({
      success: true,
      data: req.logout(),
      message: `خروج از پنل با موفقیت انجام شد`
    });
  },


  update: async (req, res) => {
    try {
      let user = req.user;
      let {
        name,
        family,
        address,
        website,
        mobile,
        phone,
      } = req.value.body;

      let result = await db.User.update(
        { name, family, address, website, mobile, phone },
        { where: { id: user.id } }
      );
      console.log('=====================================>', result);

      if (result[0]) {
        res.json({
          success: true,
          message: `The update has been successfully`
        });
      } else {
        res.status(404).json({
          success: false,
          message: `User not found!`
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: `Error on server, Please try again! ERROR:${err}`
      });
    }
  },

  changeAvatar: async (req, res) => {
    try {
      let user = req.user;
      let { avatar } = req.value.body;

      const result = await db.User.update(
        { avatar: avatar.filename },
        { where: { id: user.id } }
      );

      if (result[0]) {
        // Delete old avatar
        const old_avatar = user.avatar.split("/").pop();
        if (old_avatar !== "user.png")
          fs.unlinkSync("assets/avatars/" + old_avatar);

        res.json({
          success: true,
          message: `The update has been successfully`
        });
      } else {
        res.status(404).json({
          success: false,
          message: `User not found!`
        });
      }

    } catch (err) {
      res.json({
        success: false,
        error: err,
        message: `Error on server, Please try again!`
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      let id = req.params.id;
      let {
        username,
        email,
        name,
        family,
        address,
        website,
        mobile,
        phone,
        about
      } = req.value.body;

      let result = await db.User.update(
        {
          username,
          email,
          name,
          family,
          address,
          website,
          mobile,
          phone,
          about
        },
        { where: { id } }
      );

      if (result[0]) {
        res.json({
          success: true,
          message: `The update has been successfully`
        });
      } else {
        res.status(404).json({
          success: false,
          message: `User not found!`
        });
      }
    } catch (error) {
      res.json({
        success: false,
        error: error,
        message: `Error on server, Please try again! Error: ${error}`
      });
    }
  },

};
