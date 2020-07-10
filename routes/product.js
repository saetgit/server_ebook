const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require('../config/multer');
const options = config.getFileOptionsUpload();
const multer = require('multer')(options);

const passportJWT = passport.authenticate("jwt", { session: false });

// Validators
const { validation, schema } = require("../validators/product-validator");
// Controllers
const ProductController = require("../app/controllers/product-controller");

router.get("/", ProductController.index);
router.get("/:id", ProductController.show);

router.post(
    "/addProduct",
    multer.single("img"),
    validation(schema.addProductSchema),
    passportJWT,
    ProductController.addProduct
);

router.delete("/:id", passportJWT, ProductController.destroy);


  
module.exports = router;
