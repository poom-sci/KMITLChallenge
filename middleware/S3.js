const fs = require("fs");
const path = require("path");

const aws = require("../database/aws.js");
const s3 = aws.s3;

//key is the destination path on S3 bucket

const uploadFiles = async (files, Key, contentType) => {
  if (!files.length) {
    const filePath = path.join(__dirname, "..", "temp", files.filename);
    const key = Key + files.originalname;

    var params = {
      Bucket: "air-mission-images",
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentType: contentType,
      ACL: "public-read",
    };

    const data = await s3
      .upload(params)
      .promise()
      .then((data) => {
        fs.unlinkSync(filePath);
        return data;
      });

    return data["Location"];
  }

  console.log(Key)

  const list = await Promise.all(
    files.map(async (item, index) => {
      const filePath = path.join(__dirname, "..", "temp", item.filename);
      const key = Key + item.originalname;
      console.log("list")
      console.log(key)
      var params = {
        Bucket: "air-mission-images",
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentType: contentType,
        ACL: "public-read",
      };

      const data = await s3
        .upload(params)
        .promise()
        .then((data) => {
          fs.unlinkSync(filePath);

          return data;
        });

      return data["Location"];
    })
  );

  return list;
};

const deleteFiles = async (Key) => {
  try {
    await Promise.all(
      Key.map(async (item, index) => {
        var params = {
          Bucket: "air-mission-images",
          Key: item,
        };

        await s3.deleteObject(params).promise();
        console.log(item)
      })
    );
    return true;
  } catch (err) {
    console.log("Error occured while trying to delete to S3 bucket", err);
    throw err;
  }
};

module.exports.uploadFiles = uploadFiles;
module.exports.deleteFiles = deleteFiles;
