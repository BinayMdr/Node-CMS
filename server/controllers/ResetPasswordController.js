require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const resetPassword =  require('../models/resetPassword')
const user = require('../models/user')
const bcrypt = require('bcrypt');

const sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: true
      });
    }

    const userData = await user.findOne({
      where:{
        email:email
      }
    })

    if(userData == null)
    {
      return res.status(400).json({
        message: 'Email not found',
        error: true
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const token = crypto.randomBytes(24).toString('base64');

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `noreply@<${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);


    await resetPassword.update(
      { is_expired: true },
      {
        where: {
          user_id: userData.dataValues.id
        }
      }
    );

    await resetPassword.create({
      token:token,
      user_id:userData.dataValues.id,
      is_expired: false
    })

    return res.json({
      message: 'Password reset link sent successfully',
      error: false
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      message: 'Error while sending mail',
      error: true
    });
  }
};

const verifyToken = async(req,res) => {
  const token = req.params.token;

  const now = new Date();

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const existToken = await resetPassword.findOne({
    where: {
      [Op.and]: [
        { token: token },
        { is_expired: false },
        { createdAt: { [Op.gte]: oneHourAgo } }
      ]
    }
  });

  return res.json({
      message: existToken == null ? false : true,
      error: false
    });

}

const changePassword = async(req,res) => {
  const token = req.params.token;
  const { password} = req.body;

  const now = new Date();

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const existToken = await resetPassword.findOne({
    where: {
      [Op.and]: [
        { token: token },
        { is_expired: false },
        { createdAt: { [Op.gte]: oneHourAgo } }
      ]
    }
  });

  if(existToken == null)
  {
    return res.status(400).json({
      message: "Token Expired",
      error: false
    });
  }

  const encryptedPassword = await bcrypt.hash(password,10);
  const userData = await user.findOne({
    where:{
      id: existToken.dataValues.user_id
    }
  })

  await userData.update({
    password: encryptedPassword
  })

  await existToken.update({
    is_expired: true
  })
  
  return res.json({
      message: "Password changed successfully",
      error: false
  });

}
module.exports = {
    sendResetLink,
    verifyToken,
    changePassword
}