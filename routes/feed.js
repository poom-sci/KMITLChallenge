const express = require("express");
// const { body } = require('express-validator/check');

const multer = require("multer");
const feedController = require("../controllers/feed");
// const isAuth = require('../middleware/is-auth');

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var fileLimits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024, // 1 MB (max file size)
};

const router = express.Router();

// setInterval(feedController.updateAir4ThaiStations, 3600 * 1000);

router.get("/stations", feedController.getStations);

router.post("/station", feedController.postStation);

router.get("/nearestStation", feedController.getNearestStation);

router.get("/station/:stationID", feedController.getStation);

router.post("/bus", feedController.postBus);

router.get("/bus", feedController.getBuses);

router.get("/bus/:stationID", feedController.getBus);

// // GET /feed/posts
// // router.get('/posts', isAuth, feedController.getPosts);
// router.get("/missions", feedController.getMissions);

// // POST /feed/post
// router.post(
//   "/createMission",
//   // multer({  dest: 'temp/',fileFilter: fileFilter }).single("coverImages"),
//   multer({ dest: "temp/", fileFilter: fileFilter }).array("missionCover", 10),
//   feedController.createMission
// );

// // POST /feed/post
// router.put(
//   "/updateMission/:missionId",
//   // multer({  dest: 'temp/',fileFilter: fileFilter }).single("coverImages"),
//   multer({ dest: "temp/", fileFilter: fileFilter }).array("missionCover", 10),
//   feedController.updateMission
// );

// // router.get('/post/:postId', isAuth, feedController.getPost);
// router.get("/mission/:missionId", feedController.getMission);

// router.get("/missionPage/:page", feedController.getMissionPage);


// router.put(
//   '/post/:postId',
//   isAuth,
//   [
//     body('title')
//       .trim()
//       .isLength({ min: 5 }),
//     body('content')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.updatePost
// );

// router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
