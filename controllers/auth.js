const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailExistence = require("email-existence");
const mongoose = require("mongoose");

const User = require("../models/user");

// const S3 = require("../middleware/S3.js");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // console.log(email)
    const email = req.body.email;
    // const username = req.body.username;
    const password = req.body.password;
    // const occupation = req.body.occupation;
    // const address = req.body.address;
    // const gender = req.body.gender;
    // const age = Number(req.body.age);

    emailExistence.check(email, function (error, response) {
      console.log("res: " + response);
    });

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
    });

    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const file = req.file;

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (file) {
      if (
        user.avatar !==
        "https://img.lovepik.com/free_png/32/23/59/70358PIC95iAmhU4dc0VY_PIC2018.png_860.png"
      ) {
        const pathSplit = user.avatar.split("/");
        const deleteKey = ["userAvatar/" + pathSplit[pathSplit.length - 1]];
        await S3.deleteFiles(deleteKey);
      }

      const key = "userAvatar/" + userId;
      const contentType = "image/jpeg";

      user["avatar"] = await S3.uploadFiles(file, key, contentType);
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    user.save().then((data) => {
      let updatedUser = data.toObject();
      delete updatedUser.password;
      res
        .status(200)
        .json({ message: "updated profile successfully", user: updatedUser });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("friendsList");

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    const populatedFriendsList = user.friendsList.map((friend, index) => {
      return {
        username: friend["username"],
        email: friend["email"],
        id: friend["_id"],
      };
    });

    res.status(200).json({
      message: "get friends data successfully",
      friendsList: populatedFriendsList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addFriends = async (req, res, next) => {
  try {
    const userId = req.userId;

    const friendsId = req.body.friendsId;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    if (Array.isArray(friendsId)) {
      await Promise.all(
        friendsId.map(async(friendId, index) => {
          if (friendId === userId) {
            return;
          }
          
          const convertedFriendId = mongoose.Types.ObjectId(friendId);
          const found= await User.findById(convertedFriendId);

          if (!user.friendsList.includes(convertedFriendId) && found ) {
            user.friendsList.push(convertedFriendId);
          }
        })
      );
    } else {
      if (friendsId !== userId) {
        const convertedFriendId = mongoose.Types.ObjectId(friendsId);
        if (!user.friendsList.includes(convertedFriendId)) {
          user.friendsList.push(convertedFriendId);
        }
      }
    }

    await user.save();
    res.status(200).json({
      message: "User add friends successfully",
      friendsList: user.friendsList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFriends = async (req, res, next) => {
  try {
    const userId = req.userId;

    const friendsId = req.body.friendsId;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    console.log(typeof user.friendsList[0]);

    if (Array.isArray(friendsId)) {
      await Promise.all(
        friendsId.map((friendId) => {
          const convertedFriendId = mongoose.Types.ObjectId(friendId);
          const index = user.friendsList.indexOf(convertedFriendId);

          if (index > -1) {
            user.friendsList.splice(index, 1);
          }
        })
      );
    } else {
      console.log(123);

      const convertedFriendId = mongoose.Types.ObjectId(friendsId);
      const index = user.friendsList.indexOf(convertedFriendId);
      if (index > -1) {
        user.friendsList.splice(index, 1);
      }
    }

    await user.save();
    res.status(200).json({
      message: "User delete friends successfully",
      friendsList: user.friendsList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
