const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require('../config/multer');
const options = config.getFileOptions();
const multer = require('multer')(options);

const passportJWT = passport.authenticate("jwt", { session: false });

// Validators
const { validation, schema } = require("../validators/product-validator");
// Controllers
const ProductController = require("../app/controllers/product-controller");

router.get("/", ProductController.index);

router.post(
    "/addProduct",
    validation(schema.addProductSchema),
    passportJWT,
    ProductController.addProduct
);


  
module.exports = router;
