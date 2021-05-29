const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// const { validationResult } = require('express-validator/check');

// const io = require('../socket');
// const Post = require('../models/post');
// const User = require('../models/user');
const Station = require("../models/station");
const Bus = require("../models/bus");

// const apiAdapter = require("../apiAdapter");

// const aws = require("../database/aws.js");
// const s3 = aws.s3;
// const S3 = require("../middleware/S3.js");
// const { compare } = require("bcryptjs");

// const BASE_URL = "http://air4thai.pcd.go.th/forappV2/getAQI_JSON.php";
// const api = apiAdapter(BASE_URL);

exports.postStation = (req, res, next) => {
  const station_ID = req.body.station_ID;
  const station_name = req.body.station_name;
  const bus_pass = req.body.bus_pass;
  const lat = req.body.lat;
  const long = req.body.long;

  console.log(req.body)

  try {
    const station = new Station({
      station_ID: station_ID,
      station_name: station_name,
      bus_pass: bus_pass,
      location: { type: "Point", coordinates: [long, lat] },
    });

    station.save();
    res.status(201).json({ message: "Station created!", station: station });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStations = (req, res, next) => {
  const stations = Station.find()
    .then((stations) => {
      const totalItems = stations.length;
      res.status(200).json({
        message: "Fetched Stations successfully.",
        data: stations,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getNearestStation = (req, res, next) => {
  const lat = req.body.lat;
  const long = req.body.long;

  Station.find({
    location: {
      $near: {
        $maxDistance: 10000000,
        $geometry: {
          type: "Point",
          coordinates: [long, lat],
        },
      },
    },
  })
    .limit(1)
    .then((station) => {
      res.status(200).json({
        message: "Fetched Nearest Station successfully.",
        station: station,
        location: [long, lat],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStation = (req, res, next) => {
  const stationID =req.params.stationID;

  Station.findOne({ station_ID: stationID })
    .then((station) => {
      res.status(200).json({
        message: "Fetched Station successfully.",
        station: station,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postBus = (req, res, next) => {
  const Bus_ID = req.body.Bus_ID;
  const lat = req.body.lat;
  const long = req.body.long;

  try {
    const bus = new Bus({
      Bus_ID: Bus_ID,
      location: { type: "Point", coordinates: [long, lat] },
    });

    bus.save();
    res.status(201).json({ message: "Bus created!", bus: bus });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBuses = (req, res, next) => {
  const Buses = Bus.find()
    .then((Buses) => {
      const totalItems = Buses.length;
      res.status(200).json({
        message: "Fetched Buses successfully.",
        data: Buses,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getBus = (req, res, next) => {
  const BusID = req.params.BusID

  Bus.findOne({ Bus_ID: BusID })
    .then((Bus) => {
      res.status(200).json({
        message: "Fetched Bus successfully.",
        Bus: Bus,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.updateAir4ThaiStations = () => {
//   console.log(123);
//   api
//     .get()
//     .then((resp) => {
//       const data = resp.data["stations"];

//       Object.keys(data).map((dataKey) => {
//         // console.log(dataKey);

//         const stationID = data[dataKey]["stationID"];
//         const nameTH = data[dataKey]["nameTH"];
//         const nameEN = data[dataKey]["nameEN"];
//         const areaTH = data[dataKey]["areaTH"];
//         const areaEN = data[dataKey]["areaEN"];
//         const date = data[dataKey]["date"];
//         const stationType = data[dataKey]["stationType"];
//         const lat = parseFloat(data[dataKey]["lat"]);
//         const long = parseFloat(data[dataKey]["long"]);
//         const AQILast = data[dataKey]["AQILast"];

//         const station = new Station({
//           stationID: stationID,
//           nameTH: nameTH,
//           nameEN: nameEN,
//           areaTH: areaTH,
//           areaEN: areaEN,
//           date: date,
//           stationType: stationType,
//           location: { type: "Point", coordinates: [long, lat] },
//           AQILast: AQILast,
//         });
//         station.save().catch((err) => console.log(err));
//         // return station;
//       });
//       // array.save()
//     })
//     .catch((err) => console.log(err));
// };

// exports.updateAir4ThaiStations = () => {
//   api
//     .get()
//     .then((resp) => {
//       const data = resp.data["stations"];

//       Object.keys(data).forEach((dataKey) => {
//         const stationID = data[dataKey]["stationID"];
//         const AQILast = data[dataKey]["AQILast"];

//         Station.findOne({
//           stationID: stationID,
//         })
//           .then((station) => {
//             station.AQILast = AQILast;
//             station.save();
//           })
//           .catch((err) => console.log(err));
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.createStation =  (req, res, next) => {
//   const stations = Station.find().then((stations) => {

//       totalItems=stations.countDocuments().then(()=>{
//         res.status(200).json({
//         message: "Fetched Stations successfully.",
//         data: stations,
//         totalItems: totalItems,
//       })}
//     )
//     .catch(err=>{console.log(err)});
// })

// exports.createMission = async (req, res, next) => {
//   // const errors = validationResult(req);

//   // if (!errors.isEmpty()) {
//   //   const error = new Error("Validation failed, entered data is incorrect.");
//   //   error.statusCode = 422;
//   //   throw error;
//   // }

//   if (!req.files) {
//     const error = new Error("No image provided.");
//     error.statusCode = 422;
//     throw error;
//   }

//   const title = req.body.title;
//   const description = req.body.description;
//   const point = Number(req.body.point);
//   const level = req.body.level;
//   const category = req.body.category;

//   const newMission = new Mission({
//     title: title,
//     description: description,
//     imagesUrl: [],
//     point: point,
//     level: level,
//     category: category,
//   });

//   try {
//     const file = req.files;
//     const key = "missionCover/" + newMission._id;
//     const contentType = "image/jpeg";
//     S3.uploadFiles(file, key, contentType)
//       .then((imagesLocation) => {
//         newMission["imagesUrl"] = imagesLocation;
//         return newMission.save();
//       })
//       .then((data) => {
//         res.json({
//           Message: "Create Mission SuceesFully",
//           CreatedMission: newMission,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.updateMission = async (req, res, next) => {
//   // const errors = validationResult(req);

//   // if (!errors.isEmpty()) {
//   //   const error = new Error("Validation failed, entered data is incorrect.");
//   //   error.statusCode = 422;
//   //   throw error;
//   // }

//   try {
//     const missionId = req.params.missionId;
//     const updatedMission = await Mission.findById(missionId);

//     const file = req.files;
//     const Key = "missionCover/" + missionId;
//     const contentType = "image/jpeg";

//     if (file) {
//       const deleteKey = updatedMission["imagesUrl"].map((url, index) => {
//         const pathSplit = url.split("/");
//         return (
//           pathSplit[pathSplit.length - 2] +
//           "/" +
//           pathSplit[pathSplit.length - 1]
//         );
//       });

//       await S3.deleteFiles(deleteKey);

//       const imagesLocation = await S3.uploadFiles(file, Key, contentType);
//       updatedMission["imagesUrl"] = imagesLocation;
//     }

//     Object.keys(req.body).forEach((key) => {
//       updatedMission[key] = req.body[key];
//     });
//     await updatedMission.save();
//     res.json({
//       Message: "Updated Mission SuceesFully",
//       UpdatedMission: updatedMission,
//     });
//   } catch (err) {
//     console.log(err);
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.getMissions = async (req, res, next) => {
//   const missions = await Mission.find();
//   try {
//     if (!missions) {
//       const error = new Error("Could not find missions.");
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ message: "Missions fetched.", missions: missions });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.getMission = async (req, res, next) => {
//   const missionId = req.params.missionId;
//   const mission = await Mission.findById(missionId);
//   try {
//     if (!mission) {
//       const error = new Error("Could not find mission.");
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ message: "Mission fetched.", mission: mission });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.getMissionPage = async (req, res, next) => {
//   // const currentPage = req.query.page || 1;

//   // try {
//   //   const totalItems = await Post.find().countDocuments();
//   //   const posts = await Post.find()
//   //     .populate('creator')
//   //     .sort({ createdAt: -1 })
//   // .skip((currentPage - 1) * perPage)
//   // .limit(perPage);

//   const currentPage = req.params.page || 1;

//   const perPage = Number(req.body.perPage) || 5;
//   const sortType = req.body.sortType || "createdAt";
//   const sortDirection = Number(req.body.sortDirection) || 1;

//   const missions = await Mission.find()
//     .sort({ [sortType]: sortDirection })
//     .skip((currentPage - 1) * perPage)
//     .limit(perPage);

//   try {
//     if (!missions) {
//       const error = new Error("Could not find mission.");
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({
//       message: `Missions page ${currentPage} fetched.`,
//       missions: missions,
//       page: currentPage,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

//
// exports.updatePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }
//   if (!imageUrl) {
//     const error = new Error('No file picked.');
//     error.statusCode = 422;
//     throw error;
//   }
//   try {
//     const post = await Post.findById(postId).populate('creator');
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator._id.toString() !== req.userId) {
//       const error = new Error('Not authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     if (imageUrl !== post.imageUrl) {
//       clearImage(post.imageUrl);
//     }
//     post.title = title;
//     post.imageUrl = imageUrl;
//     post.content = content;
//     const result = await post.save();
//     io.getIO().emit('posts', { action: 'update', post: result });
//     res.status(200).json({ message: 'Post updated!', post: result });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.deletePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   try {
//     const post = await Post.findById(postId);

//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator.toString() !== req.userId) {
//       const error = new Error('Not authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     // Check logged in user
//     clearImage(post.imageUrl);
//     await Post.findByIdAndRemove(postId);

//     const user = await User.findById(req.userId);
//     user.posts.pull(postId);
//     await user.save();
//     io.getIO().emit('posts', { action: 'delete', post: postId });
//     res.status(200).json({ message: 'Deleted post.' });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// const clearImage = filePath => {
//   filePath = path.join(__dirname, '..', filePath);
//   fs.unlink(filePath, err => console.log(err));
// }
