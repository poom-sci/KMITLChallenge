const aws = require("aws-sdk");

require("dotenv").config();

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION,
  
});


const s3 = new aws.S3();

module.exports.s3 = s3;
