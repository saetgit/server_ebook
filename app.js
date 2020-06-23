const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const dotenv = require("dotenv").config();

class Server {
  constructor() {
    this.port = process.env.DB_PORT || 5003;
    this.app = express();
    this.app.use("/img", express.static(__dirname + "/assets/avatars"));
    this.app.use("/uploads", express.static(__dirname + "/assets/images"));

    this.initDB();
    this.initPassport();
    this.initMiddlewares(this.app);
    this.initRoutes(this.app);
    // this.initSwagger(this.app);
    this.start(this.port, this.app);
  }

  initPassport() {
    // Bring in the passport authenticaion strategy
    require("./config/passport")(passport);
  }

  initDB() { }

  initRoutes(app) {
    app.set("trust proxy", true);
    app.use("/api/users", require("./routes/user"));
   

    // Handle error when status code error is 500
    app.use((err, req, res, next) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: err
        });
      }
    });
  }

  initMiddlewares(app) {
    // Middllwares
    app.use(logger("dev"));
    app.use(bodyParser.json());
    // Passport Middlewares
    app.use(passport.initialize());
    app.use(passport.session());
    // CORS
    app.use(cors());
  }

 

  start(port, app) {
    // Run the server!
    const start = async () => {
      try {
        await app.listen(port);
        console.log(`Server run at http://localhost:${port}`);
      } catch (err) {
        throw err;
      }
    };

    start();
  }
}

new Server();
