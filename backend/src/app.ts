import express from "express";
import { Router } from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import * as mongoDB from "mongodb";
import { MONGODB_URI, SESSION_SECRET, DB_PASSWORD, DB_USERNAME, CA_DIR } from "./config/config";


// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";
import * as coinController from "./controllers/CoinController";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
mongoose.Promise = bluebird;

console.log("connecting to mongodb....");
mongoose
  .connect(MONGODB_URI, {
    tls: true,
    tlsCAFile: `${CA_DIR}/rds-combined-ca-bundle.pem`,
    tlsAllowInvalidCertificates: true,
    sslValidate: false,
    auth: { user: DB_USERNAME, password: DB_PASSWORD}  
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log(`succesfully connected to MongoDB at ${MONGODB_URI}`);
    mongoose.Query;
  })
  .catch((err) => {
    console.error(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: MONGODB_URI,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

const baseRouter = Router();

/**
 * user routes
 */
const userRouter = Router();
userRouter.get("/", homeController.index);
userRouter.get("/login", userController.getLogin);
userRouter.post("/login", userController.postLogin);
userRouter.get("/logout", userController.logout);
userRouter.get("/forgot", userController.getForgot);
userRouter.post("/forgot", userController.postForgot);
userRouter.get("/reset/:token", userController.getReset);
userRouter.post("/reset/:token", userController.postReset);
userRouter.get("/signup", userController.getSignup);
userRouter.post("/signup", userController.postSignup);
userRouter.get("/contact", contactController.getContact);
userRouter.post("/contact", contactController.postContact);
userRouter.get(
  "/account",
  passportConfig.isAuthenticated,
  userController.getAccount
);
userRouter.post(
  "/account/profile",
  passportConfig.isAuthenticated,
  userController.postUpdateProfile
);
userRouter.post(
  "/account/password",
  passportConfig.isAuthenticated,
  userController.postUpdatePassword
);
userRouter.post(
  "/account/delete",
  passportConfig.isAuthenticated,
  userController.postDeleteAccount
);
userRouter.get(
  "/account/unlink/:provider",
  passportConfig.isAuthenticated,
  userController.getOauthUnlink
);

baseRouter.use("/users", userRouter);

/**
 * Crypto-coin routes.
 */
const coinRouter = Router();
coinRouter.get("/", coinController.getCoinsPeriodList);
coinRouter.get("/:coin/:period", coinController.getCoinData);

baseRouter.use("/coins", coinRouter);

baseRouter.get("/health", (req, res) => {
  res.status(200).send("Ok");
});

app.use("/api/v1", baseRouter);

export default app;
