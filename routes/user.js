const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require('../config/multer');
const options = config.getFileOptions();
const multer = require('multer')(options);

const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });
const passportAdminJWT = passport.authenticate("isAdminJWT", {
    session: false
});

// Validators
const { validation, schema } = require("../validators/user-validator");
// Controllers
const UserController = require("../app/controllers/user-controller");
router.get("/me", passportJWT, UserController.me);
router.get("/logout", UserController.logout);
router.post("/signup", validation(schema.signUpSchema), UserController.signUp);
router.post(
    "/signin",
    validation(schema.signInSchema),
    passportSignIn,
    UserController.signIn
);

router.put(
    "/update/:id",
    validation(schema.updateUserListSchema),
    passportJWT,
    UserController.updateUser
  );


module.exports = router;
