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
import { MONGODB_URI, SESSION_SECRET } from "./config/config";
import Coin from "./models/CoinModel";

// import { prop, Ref, getModelForClass } from "@typegoose/typegoose";

// class TimePrice {
//   @prop({ required: true })
//   time: string;

//   @prop({ required: true })
//   price: number;
// }

// class Prices {
//   @prop({ required: true, ref: () => TimePrice })
//   close: Ref<TimePrice>[];
// }

// class CoinSchema {
//   @prop({ required: true })
//   symbol: string;

//   @prop({ required: true, ref: () => Prices })
//   past: Ref<Prices>;

//   @prop({ required: true, ref: () => Prices })
//   prediction: Ref<Prices>;

//   @prop({ required: true })
//   period: string;

//   @prop({ required: true })
//   MAPE: number;
// }

// var url = "mongodb://localhost:27017/";

// myMongo = Mongo



export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://localhost:27017/db_name");

  await client.connect();

  const db: mongoDB.Db = client.db("db_name");

  // const coinCollection: mongoDB.Collection = db.collection("forecasts");

  // collections.games = gamesCollection;
  // const x = coinCollection.find({});
  // const y = x.hasNext() ? x.next() : null;

  // const coin_name = "BTC-USD";
  // const coin_period = "1h";

  // console.log("gettin coin data", coin_name, coin_period);

  // console.log(coinCollection.find({ symbol: coin_name, period: coin_period }))

  console.log(`cool! Successfully connected to database: ${db.databaseName} `);//and collection: ${coinCollection.collectionName}`);


  // const myCoin = new Coin({
  //   "symbol": "MY-COIN",
  //   "past": [{
  //       "timestamp": "1633917600000",
  //       "close": "3549.58",
  //     }],
  //   "prediction": [{
  //       "timestamp": "1633917700000",
  //       "close": "3549.60",
  //     },
  //     {
  //       "timestamp": "1633917800000",
  //       "close": "3549.70",
  //     }],
  //   "period": "1h",
  //   "MAPE": "4.084071411815125"
  // });

  // myCoin.save();


  console.log("ok");
  const myFoundCoin = await Coin.findOne({ "symbol": "ALGO-USD" });
  console.log(myFoundCoin);
  console.log(myFoundCoin.past);

  // console.log(Coin.find({ "symbol": "MY-COIN" }));

  console.log("ok2");


  // const doc = new CoinSchema({
  //   name: 'Bill',
  //   email: 'bill@initech.com',
  //   avatar: 'https://i.imgur.com/dM7Thhn.png'
  // });
  // await doc.save();

  // const myFoundCoin: Array<ICoin> = await Coin.find({});




  // coinCollection.find().each(function (err, doc) {
  //   // // Check for error
  //   // if (err) return console.err(err);
  //   // // Log document
  //   console.log(doc);
  // })



  // console.log(myCoin.symbol)

  // const games = (await coinCollection.find({}).toArray()) as Coin[];
}


connectToDatabase();



// // var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.collection("customers").findOne({}, function (err, result) {
//     if (err) throw err;
//     console.log(result.name);
//     db.close();
//   });
// });

// const CoinModel = getModelForClass(CoinSchema); // UserModel is a regular Mongoose Model with correct types

// mongoose.connect("mongodb://localhost:27017/", { dbName: "db_name" });

// const coin_name = "BTC-USD";
// const coin_period = "1h";
// // const { _id: id } = await CoinModel.create({ name: 'JohnDoe', jobs: ['Cleaner'] } as User); // an "as" assertion, to have types for all properties
// console.log("gettin coin data", coin_name, coin_period);

// // const myCoin = CoinModel.find({symbol: "BTC-USD", period: "1h" })
// //   .exec()
// //   .then((coin) => {console.log(coin)})
// //   .catch((err) => console.log("didn't do it" + err));

// // console.log(myCoin); // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }

// // await myCoin[Symbol]

// console.log("ok done");



// // process.exit(0);

// if (err) throw err;
// var dbo = db.db("mydb");
// dbo.collection("customers").findOne({}, function (err, result) {
//   if (err) throw err;
//   console.log(result.name);
//   db.close();
// });





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
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

console.log("connecting to mongodb....");
mongoose
  .connect(mongoUrl)
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log(`succesfully connected to MongoDB at ${mongoUrl}`);
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
      mongoUrl,
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

app.use("/api/v1", baseRouter);

export default app;
