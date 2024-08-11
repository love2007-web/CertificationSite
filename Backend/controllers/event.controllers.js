const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const shortid = require("shortid");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const pdf = require("html-pdf");
const csv = require("csvtojson");
const fs = require("fs");
const qrcode = require("qrcode");
const User = require("../models/user");
const Event = require("../models/event");
const Certificate = require("../models/certificate");
const emailTemplates = require("../emails/email");
const htmlTemplates = require("../templates/html-1");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
});

const s3 = new AWS.S3();

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const sentFrom = new Sender(
  "you@trial-z86org8z651gew13.mlsender.net",
  "Certify"
);

const handleError = (res, status, message, error) => {
  console.error(error);
  res.status(status).json({ message });
};

const addEvent = async (req, res) => {
  if (!req.body.secret || req.body.secret !== process.env.AdminSignupCode) {
    return handleError(res, 403, "Only admins can create an event");
  }

  try {
    const { name, date } = req.body;
    const created_by = req.user.userId;

    const event = new Event({
      _id: new mongoose.Types.ObjectId(),
      name,
      date,
      created_by,
    });

    const savedEvent = await event.save();
    await User.updateOne(
      { _id: created_by },
      { $push: { events: { event_id: savedEvent._id, is_admin: true } } }
    );
    savedEvent.admins.push({ admin_id: created_by });
    await savedEvent.save();

    res.status(201).json({ event: savedEvent });
  } catch (err) {
    handleError(res, 400, "Error creating event", err);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    await Event.deleteOne({ _id: event_id });
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    handleError(res, 400, "Error deleting event", err);
  }
};

const getEventByID = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.status(200).json({ message: "Event Found", event });
    } else {
      res.status(404).json({ message: "Event not Found" });
    }
  } catch (err) {
    handleError(res, 400, "Error retrieving event", err);
  }
};

const updateEvent = async (req, res) => {
  try {
    await Event.updateOne({ _id: req.body._id }, req.body);
    res.status(200).json({ message: "Event Updated" });
  } catch (err) {
    handleError(res, 400, "Error updating event", err);
  }
};

const getCertificates = async (req, res) => {
  try {
    const { event_id, templateNumber } = req.body;

    const templateNumberAsNumber = Number(templateNumber);
    const users = await csv().fromFile(req.file.path);

    const validUsers = users.filter(
      (user) => user.name && user.email && user.event && user.score && user.date
    );

    // Remove the uploaded CSV file after parsing
    fs.unlinkSync(req.file.path);

    const htmlContents = [];
    let successCount = 0;

    for (const user of validUsers) {
      try {
        const auth_params = shortid.generate();
        const QRCodeLINK = `http://localhost:3000/verify?id=${auth_params}`; // Consider using an environment variable for the base URL
        user.link = QRCodeLINK;

        const qr = await qrcode.toDataURL(QRCodeLINK);
        const buff = Buffer.from(
          qr.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const s3Params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${user.name}.jpeg`,
          Body: buff,
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        };

        const { Location } = await s3.upload(s3Params).promise();

        let htmlContent;

        switch (templateNumberAsNumber) {
          case 1:
            htmlContent = await htmlTemplates.TEMPLATE_1(user, Location, user.link);
            break;
          case 2:
            htmlContent = await htmlTemplates.TEMPLATE_2(user, Location, user.link);
            break;
          case 3:
            htmlContent = await htmlTemplates.TEMPLATE_3(user);
            break;
          default:
            console.error("Invalid template number:", templateNumberAsNumber);
            continue;
        }

        if (!htmlContent) {
          console.error("Failed to generate HTML content for user:", user);
          continue;
        }

        htmlContents.push(htmlContent);

        const filename = `gg${Date.now()}`;
        const pdfStream = await new Promise((resolve, reject) => {
          pdf
            .create(htmlContent, {
              height: "608px",
              width: "1080px",
              timeout: "100000",
            })
            .toStream((err, stream) => {
              if (err) {
                reject(err);
              } else {
                resolve(stream);
              }
            });
        });

        await uploadToS3(
          pdfStream,
          filename,
          user.email,
          event_id,
          validUsers.length === htmlContents.length,
          user.name,
          QRCodeLINK,
          auth_params
        );

        successCount++;
      } catch (error) {
        console.error("Error generating certificate for user:", user, error);
      }
    }

    if (successCount > 0) {
      res.status(200).json({ message: "Certificates generated successfully" });
    } else {
      res.status(500).json({ message: "No certificates were generated." });
    }
  } catch (err) {
    handleError(res, 500, "Error generating certificates", err);
  }
};


const uploadToS3 = async (
  body,
  filename,
  email,
  event_id,
  isLast,
  name,
  QRCodeLINK,
  auth_params
) => {
  try {
    const s3Params = {
      Body: body,
      ACL: "public-read",
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${filename}.pdf`,
    };

    const { Location } = await s3.upload(s3Params).promise();

    let user = await User.findOne({ email });

    const eventDetails = {
      event_id,
      certificate_link: Location,
    };

    if (!user) {
      const randomPassword = shortid.generate(); // Generate a more secure random password
      const hash = await bcrypt.hash(email, 10);
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: hash,
        name,
        isEmailVerified: true,
        events: [eventDetails],  // Add the event details to the user's events array
      });

      await user.save();

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([new Recipient(email, name)])
        .setSubject("Certify: Certificate Generation")
        .setHtml(
          `<html><h4>Hey ${name},</h4><p>Your certificate for the event has been generated. To view the certificate, please login to certify.jugaldb.com with email: ${email} and password: ${randomPassword}</p></html>`
        );

      await mailerSend.email.send(emailParams);
    } else {
      // Add the new event details to the user's events array
      await User.updateOne(
        { email },
        { $push: { events: eventDetails } }
      );
    }

    await Event.updateOne(
      { _id: event_id },
      {
        $push: {
          participants: {
            participant_name: name,
            participant_email: email,
            certificate_link: Location,
          },
        },
      }
    );

    const certificate = new Certificate({
      _id: new mongoose.Types.ObjectId(),
      certificate_link: Location,
      auth_link: QRCodeLINK,
      auth_params,
      event_id,
      user_name: name,
      user_email: email,
    });

    await certificate.save();

    console.log(`Certificate uploaded and processed for ${name} (${email})`);
  } catch (err) {
    console.error("Error uploading to S3:", err);
  }
};


module.exports = {
  addEvent,
  deleteEvent,
  getEventByID,
  updateEvent,
  getCertificates,
};
