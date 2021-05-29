const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const apiAdapter = require("./apiAdapter");

// const BASE_URL = "http://air4thai.pcd.go.th/forappV2/getAQI_JSON.php";
// const api = apiAdapter(BASE_URL);

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const { compare } = require("bcryptjs");

require("dotenv").config();

const app = express();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
// app.use(
//   multer({ dest: 'temp/', fileFilter: fileFilter }).array('uploadedImages', 10)
// );
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use("/help", (req, res, next) => {
  res.status(200).send(`
      <h2>function</h2>
  `);
  // res.status(200).send('Welcome to AirMission RESTFUL API');
  // res.status(200).json({
  //   message: 'Welcome to AirMission RESTFUL API',
  // });
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {

  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({message: message, data: data });
});

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;

mongoose
  .connect(
    "mongodb+srv://" +
      username +
      ":" +
      pass +
      "@cluster0.fd4yi.mongodb.net/" +
      database +
      "?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then((result) => {
    const server = app.listen(port);

    // const io = require('./socket').init(server);
    // io.on('connection', socket => {
    // console.log('Client connected');
    // });
  })
  .catch((err) => console.log(err));
