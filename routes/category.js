const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require('../config/multer');
const options = config.getFileOptions();
const multer = require('multer')(options);

const passportJWT = passport.authenticate("jwt", { session: false });

// Validators
const { validation, schema } = require("../validators/category-validator");
// Controllers
const categoryController = require("../app/controllers/category-controller");

router.get("/", passportJWT, categoryController.index);

router.post(
    "/addcategory",
    validation(schema.addCategorySchema),
    passportJWT,
    categoryController.addCategory
);
router.delete("/:id", passportJWT, categoryController.destroy);

  
module.exports = router;
