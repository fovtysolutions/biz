const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const auth = require("../config/auth");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require("dotenv").config();

const sendOtpToMobile = async (mobile) => {
  const otp = Math.floor(100000 + Math.random() * 900000); 
  console.log(`Sending OTP ${otp} to mobile ${mobile}`);
  return otp;
};

const withMobile = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid or missing mobile number' });
    }
    const otp = await sendOtpToMobile(mobile);
    await Otp.deleteMany({ mobile });

    const otpDoc = new Otp({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    });
    await otpDoc.save();
    
    return res.status(200).json({ "status": "success", message: 'OTP sent successfully', mobile , otp});
  } catch (error) {
    console.error('Error in withMobile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile and OTP required' });
    }

    const otpDoc = await Otp.findOne({ mobile, otp });

    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ error: 'OTP expired' });
    }

    const user = new User ({
      mobile
    });
    await user.save();

    await Otp.deleteOne({ _id: otpDoc._id }); // Clean up
    return res.status(200).json({ "status": "success",  message: 'OTP verified successfully' });

  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT, 
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false 
  }
});

const withEmail = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid or missing email' });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Our App!',
      html: `<h3>Hello!</h3><p>Your email <b>${email}</b> was successfully registered.</p>`
    };

    await transporter.sendMail(mailOptions);

    await User.updateOne(
      { mobile: mobile },    
      { email: email }            
    );

    return res.status(200).json({
      status: 'success',
      message: `Confirmation email sent to ${email}`
    });
  } catch (error) {
    console.error('Error in withEmail:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const signUp = async (req, res) => {
  try {
    const { fullname, username, password, mobile } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.updateOne(
      { mobile },
      {
        $set: {
          fullname,
          username,
          password: hashedPassword
        }
      }
    );

    return res.status(200).json({
      status: 'success',
      message: `You are register successfully!!`,
      result
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
      });
    }

    const token = auth.signInToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'You are signed in successfully!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        mobile: user.mobile,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error in signIn:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  withMobile,
  verifyOtp,
  withEmail,
  signUp,
  signIn
};