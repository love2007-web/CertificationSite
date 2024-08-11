const shortid = require('shortid');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const pdf = require('html-pdf');
const csv = require('csvtojson');
const fs = require('fs');
const User = require('../models/user');
const Event = require('../models/event');
const Certificate = require('../models/certificate');
const emailTemplates = require('../emails/email');
const htmlTemplates = require('../templates/html-1');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const viewCertificateDetailsFromQrCode = async (req, res, next) => {
  try {
    const authParams = req.body.code;
    console.log(req.body);

    const certificateDoc = await Certificate.findOne({ auth_params: authParams })
      .populate({
        path: "event_id",
        select: "name participants date",
        populate: "event_id"
      });

    console.log(certificateDoc);

    if (certificateDoc) {
      res.status(200).json({
        message: "This certificate is valid",
        certificateDoc,
      });
    } else {
      res.status(403).json({
        message: "This is not a valid certificate",
      });
    }
  } catch (error) {
    console.error('Error retrieving certificate:', error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

module.exports = {
  viewCertificateDetailsFromQrCode,
};
