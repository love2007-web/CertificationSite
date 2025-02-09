const shortid = require('shortid')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config()
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const emailTemplates = require('../emails/email');

const mailerSend = new MailerSend({
	apiKey: process.env.API_KEY,
  });

  const sentFrom = new Sender("you@trial-7dnvo4dj83345r86.mlsender.net", "Certify");
  
  const userRegister = (req, res, next) => {
	User.find({ email: req.body.email })
	  .exec()
	  .then((user) => {
		if (user.length >= 1) {
		  res.status(409).json({
			message: "Email Exists"
		  });
		} else {
		  bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (err) {
			  return res.status(500).json({
				error: err,
			  });
			} else {
			  const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email,
				password: hash,
				name: req.body.name,
				isEmailVerified: false,
			  });
			  user
				.save()
				.then(async (result) => {
				  result.verification_key = shortid.generate();
				  result.verification_key_expires = new Date().getTime() + 20 * 60 * 1000;
				  await result.save().then((result1) => {
					const emailParams = new EmailParams()
					  .setFrom(sentFrom)
					  .setTo([new Recipient(result.email)])
					  .setSubject("Certify: Email Verification")
					  .setHtml(emailTemplates.VERIFY_EMAIL(result1));
  
					mailerSend.email.send(emailParams)
					  .then((response) => {
						console.log("Email sent", response);
						res.status(201).json({
						  userDetails: {
							userId: result._id,
							email: result.email,
							name: result.name,
						  },
						});
					  })
					  .catch((err) => {
						console.log(err);
						res.status(500).json({
						  message: err.toString()
						});
					  });
				  }).catch((err) => {
					console.log(err);
					res.status(400).json({
					  message: err.toString()
					});
				  });
				}).catch((err) => {
				  console.log(err);
				  res.status(500).json({
					message: err.toString()
				  });
				});
			}
		  });
		}
	  }).catch((err) => {
		console.log(err);
		res.status(500).json({
		  message: err.toString()
		});
	  });
  }


const userLogin = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Using findOne for better readability
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed: Email not found",
        });
      }

      // Uncomment and use email verification if required
      // if (!user.is_email_verified) {
      // 	return res.status(409).json({
      // 		message: "Please verify your email",
      // 	});
      // }

      // Compare password
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          console.error("Bcrypt error:", err);
          return res.status(500).json({
            message: "An error occurred during authentication",
          });
        }

        if (!result) {
          return res.status(401).json({
            message: "Incorrect Login Credentials",
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            userId: user._id,
            userType: user.userType,
            email: user.email,
            name: user.name,
            mobileNumber: user.mobileNumber,
          },
          process.env.JWT_SECRET, // Ensure this is correctly set
          {
            expiresIn: "1d",
          }
        );

        // Send success response
        return res.status(200).json({
          message: "Auth successful",
          userDetails: {
            userType: user.userType,
            userId: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
          },
          token,
        });
      });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({
        error: "An error occurred while processing the request.",
      });
    });
};



const verifyEmail = async (req, res, next) => {
  const { verification_key } = req.body;
	await User.findOne({ verification_key })
		.then(async (user) => {
			if (Date.now() > user.verification_key_expires) {
				res.status(401).json({
					message: "Pass key expired",
				});
			}
			user.verification_key = null;
			user.verification_key_expires = null;
			user.is_email_verified = true;
			await user
				.save()
				.then((result1) => {
					res.status(200).json({
						message: "User verified",
					});
				})
				.catch((err) => {
					res.status(400).json({
						message: "Some error",
						error: err.toString(),
					});
				});
		})
		.catch((err) => {
			res.status(409).json({
				message: "Invalid verification key",
				error: err.toString(),
			});
    });
}

const resendVerifyMail = async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (user) {
	  user.verification_key = shortid.generate();
	  user.verification_key_expires = new Date().getTime() + 20 * 60 * 1000;
	  await user.save().then((result) => {
		const emailParams = new EmailParams()
		  .setFrom(sentFrom)
		  .setTo([new Recipient(email)])
		  .setSubject("Quzzie: Email Verification")
		  .setHtml(emailTemplates.VERIFY_EMAIL(result));
  
		mailerSend.email.send(emailParams)
		  .then((response) => {
			res.status(200).json({
			  message: "Email verification key sent to email",
			});
		  }).catch((err) => {
			console.log(err);
			res.status(500).json({
			  error: err.toString(),
			});
		  });
	  }).catch((err) => {
		console.log(err);
		res.status(400).json({
		  message: "Some error occurred",
		  error: err.toString(),
		});
	  });
	}
  }

const seeAllEvents = async (req, res, next) => {
  const _id = req.user.userId
  const user = await User.findById( _id )      
  .populate({
    path: "events",
    select: "name participants date",
    populate:"event_id"
  })
  console.log(user)
  console.log(user.events)
  if(user){
    return res.status(200).json({
      message: 'Events found',
      events: user.events
    })
  }
  else{
    return res.status(404).json({
      message: 'User not found'
    })
  }
}

const forgotPassword = async (req, res, next) => {
	var email = req.body.email;
	User.findOne({ email: email }, (err, userData) => {
	  if (!err && userData != null) {
		userData.pass_reset_key = shortid.generate();
		userData.pass_key_expires = new Date().getTime() + 20 * 60 * 1000; // pass reset key only valid for 20 minutes
		userData.save().then((x) => {
		  const html = emailTemplates.FORGOT_PASSWORD(x);
		  const emailParams = new EmailParams()
			.setFrom(sentFrom)
			.setTo([new Recipient(email)])
			.setSubject("Quizzie: Password Reset Request")
			.setHtml(html);
  
		  mailerSend.email.send(emailParams)
			.then((response) => {
			  res.status(200).json({
				message: "Password reset key sent to email",
			  });
			}).catch((err) => {
			  res.status(500).json({
				error: err.toString(),
			  });
			});
		});
	  } else {
		res.status(400).send("Email is incorrect");
	  }
	});
  }

const resetPassword = async (req, res, next) => {
  let resetKey = req.body.resetKey;
	let newPassword = req.body.newPassword;

	await User.findOne({ passResetKey: resetKey })
		.then(async (result) => {
			if (Date.now() > result.passKeyExpires) {
				res.status(401).json({
					message: "Pass key expired",
				});
			}
			result.password = bcrypt.hashSync(newPassword, 10);
			result.pass_reset_key = null;
			result.pass_key_expires = null;
			await result
				.save()
				.then((result1) => {
					res.status(200).json({
						message: "Password updated",
					});
				})
				.catch((err) => {
					res.status(403).json({
						message: "Unusual error",
						err: err.toString(),
					});
				});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Invalid pass key",
			});
		});
}

const changePassword = async (req, res, next) => {
  await User.findOne({ _id: req.user.userId })
  .then(async (result) => {
    bcrypt.compare(req.body.password, result.password, (err, result1) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      if (result1) {
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            res.status(400).json({
              err,
            });
          }
          User.updateOne(
            { _id: req.user.userId },
            { $set: { password: hash } }
          )
            .then((result) => {
              res.status(200).json({
                message: "Password changed",
              });
            })
            .catch((err) => {
              res.status(400).json({
                message: "error",
                error: err.toString(),
              });
            });
        });
      } else {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
    });
  })
  .catch((err) => {
    res.status(400).json({
      error: err.toString(),
    });
  });
}

const getMe = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId)
  if(user){
    res.status(200).json({
      message:"Found",
      user,
    })
  }
  else{
    res.status(400).json({
      message:"Bad request"
    })
  }
}

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, profilePicture } = req.body;

  try {
    // Find the user and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(profilePicture && { profilePicture }),
        },
      },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while updating the profile",
      error: err.toString(),
    });
  }
};


module.exports = {
  userRegister,
  userLogin,
  verifyEmail,
  resendVerifyMail,
  seeAllEvents,
  resetPassword,
  forgotPassword,
  changePassword,
  getMe,
  updateProfile
}
