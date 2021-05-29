const express = require("express");
const { body } = require("express-validator/check");
const multer = require("multer");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

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

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.put(
  "/updateProfile",
  isAuth,
  multer({
    dest: "temp/",
    fileFilter: fileFilter,
    limits: fileLimits,
  }).single("avatar"),
  authController.updateProfile
);

// router.get('/status', isAuth, authController.getUserStatus);

// router.patch(
//   "/status",
//   isAuth,
//   [body("status").trim().not().isEmpty()],
//   authController.updateUserStatus
// );


router.get(
  "/getFriends",
  isAuth,
  // isAuth,
  // [body("status").trim().not().isEmpty()],
  authController.getFriends
);

router.put(
  "/addFriends",
  isAuth,
  // isAuth,
  // [body("status").trim().not().isEmpty()],
  authController.addFriends
);

router.delete(
  "/deleteFriends",
  isAuth,
  // isAuth,
  // [body("status").trim().not().isEmpty()],
  authController.deleteFriends
);



module.exports = router;
