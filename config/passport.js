const JwtStrategy = require("passport-jwt").Strategy;
const localStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const db = require("../app/models/index");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  // To authenticate the User by JWT Strategy
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        let user = await db.User.findOne({
          where: {
            id: jwt_payload.data.id
          }
        });

        // Find the user specified in token
        if (user) {
          // Absolute path for avatar
          user.dataValues.avatar =
            process.env.APP_URL + "/img/" + user.dataValues.avatar;
          return done(null, user);
        }
        // User dosn't exist
        return done(null, false);
      } catch (error) {
        done(error, false);
      }
    })
  );

  passport.use(
    "isAdminJWT",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        let user = await db.User.findOne(jwt_payload.data._id);

        // Find the user specified in token
        if (user && user.type === "admin") return done(null, user);
        // User dosn't exist
        return done(null, false);
      } catch (error) {
        done(error, false);
      }
    })
  );

  // To authenticate the User by local Strategy
  let optsLocal = {};
  optsLocal.usernameField = "email";

  passport.use(
    new localStrategy(optsLocal, async (username, password, done) => {
      try {
        let status = username.includes("@") ? "email" : "username"

        if (status === "email") {
          // Find the user given the email
          let user = await db.User.findOne({ where: { email: username } });
         
          // If not, handle it
          if (!user) {
            return done(null, false);
          }

          // Check if the password is correct
          let isMatch = await bcrypt.compare(password, user.password);

          // If not, handle it
          if (!isMatch) {
            return done(null, false);
          }

          // Otherwise, return the user
          done(null, user);

        } else if (status === "username") {
          // Find the user given the username
          let user = await db.User.findOne({ where: { username: username } });

          // If not, handle it
          if (!user) {
            return done(null, false);
          }

          // Check if the password is correct
          let isMatch = await bcrypt.compare(password, user.password);

          // If not, handle it
          if (!isMatch) {
            return done(null, false);
          }

          // Otherwise, return the user
          done(null, user);
        }

      } catch (error) {
        done(error, false);
      }
    })
  );

  

};
