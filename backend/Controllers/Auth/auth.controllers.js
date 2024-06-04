const bcrypt = require("bcryptjs");
const User = require("../../Models/user.model.js");
const generateTokenAndSetCookie = require("../../Utils/generateToken.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const linkedin_client_id = process.env.LINKEDIN_CLIENT_ID;
const linkedin_client_secret = process.env.LINKEDIN_CLIENT_SECRET;
const linkedin_redirect_uri = process.env.LINKEDIN_REDIRECT_URI;
const Teacher_Details = require('../../Models/teacher_details.model.js')

/* --------------- Login Functionality --------------------- */

const login = async (req, res) => {
  try {
    const { email, social_id, password, account_type, linkedin_code } =
      req.body;
    let user;
    let picture;
    switch (account_type) {
      case "custom":
        user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "User not registered" });
        }
        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password || ""
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid email or password" });
        }
        break;
      case "google":
        user = await User.findOne({ email: email, account_type: "google" });
        if (!user) {
          return res.status(400).json({ error: "User not registered" });
        }
        break;
      case "linkedin":
        console.log(linkedin_code);
        const response = await axios.post(
          `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedin_code}&client_id=${linkedin_client_id}&client_secret=${linkedin_client_secret}&redirect_uri=${linkedin_redirect_uri}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const accessToken = response.data.access_token;

        const user_response = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const user_data = user_response.data;
        picture = user_data.picture;

        user = await User.findOne({
          social_id: user_data.sub,
          account_type: "linkedin",
        });
        if (!user) {
          return res.status(400).json({ error: "User not registered" });
        }

        break;
      case "facebook":
        user = await User.findOne({ social_id: social_id, account_type: "facebook" });
        if (!user) {
          return res.status(400).json({ error: "User not registered" });
        }
    }

    console.log(user);
    const token = generateTokenAndSetCookie(user._id, res);


    // Update user's online status to true
    await User.findByIdAndUpdate(user._id, { online: true });
    const userDetails = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      online: user.online,
      type: user.type,
      account_type,
      token,
    };
    if (account_type === "custom") {
      userDetails.profilePic = user.profilePic;
    }
    else if (account_type === "linkedin") {
      userDetails.profilePic = picture;
    }
    console.log("User logged in:", userDetails);
    console.log("Token:", token);
    res.status(200).json(userDetails);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ------------------ Sign Up Functionality -------------------------------- */

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      account_type,
      type,
      profilePic,
      linkedin_code,
      l_email,
      l_name,
      l_social_id,
      f_social_id,
      f_email,
    } = req.body;

    let newUser;
    switch (account_type) {
      case "custom":
        if (password !== confirmPassword) {
          return res.status(400).json({ error: "Passwords don't match" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ error: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser = new User({
          fullName,
          email,
          password: hashedPassword,
          account_type,
          type,
        });
        break;
      case "google":
        newUser = new User({
          email,
          fullName,
          account_type,
          verified: true,
          type,
          profilePic,
        });
        break;
      case "linkedin":
        let picture;
        try {
          if (linkedin_code) {
            const response = await axios.post(
              `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedin_code}&client_id=${linkedin_client_id}&client_secret=${linkedin_client_secret}&redirect_uri=${linkedin_redirect_uri}`,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );
            const accessToken = response.data.access_token;

            const user_response = await axios.get(
              "https://api.linkedin.com/v2/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const user_data = user_response.data;
            picture = user_response.picture;
            console.log(user_data);

            // Check if email is available through the user's linkedin account
            const email_regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
            const is_valid_email = email_regex.test(user_data.email);

            if (!is_valid_email)
              return res
                .status(422)
                .json({
                  message: "Email not present",
                  l_name: user_data.name,
                  l_social_id: user_data.sub,
                });

            newUser = new User({
              social_id: user_data.sub,
              email: user_data.email,
              fullName: user_data.name,
              account_type,
              verified: user_data.email_verified,
              type,
            });
          } else {
            newUser = new User({
              social_id: l_social_id,
              email: l_email,
              fullName: l_name,
              account_type: "linkedin",
              verified: false,
              type,
            });
          }
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ error: "Failed to signup. Please try again." });
          return;
        }
        break;
      case "facebook":
        // Check if email is available through the user's linkedin account
        const email_regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
        const is_valid_email = email_regex.test(f_email);
        if (!is_valid_email) {
          return res
            .status(422)
            .json({
              message: "Email not present",
              f_name: fullName,
              f_social_id: f_social_id,
            });
        }
        newUser = new User({
          social_id: f_social_id,
          email: f_email,
          fullName,
          account_type,
          verified: true,
          type,
        });
    }

    // Generate JWT token here
    const token = generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - JWT token not provided" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);

    await User.findByIdAndUpdate(userId, { online: false });
    console.log(user);
    res.status(200).json({
      message: "Logged out successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        online: false,
      },
    });

  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  //const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    return res
      .status(500)
      .json({ error: "Password and Confirm Password does not match" });
  }
  //console.log(id)
  try {
    // Find the admin by ID
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - JWT token not provided" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);

    console.log(user);
    if (!user || !user.password) {
      return res.status(401).json({ error: "User or password not found" });
    }

    // Compare current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(Math.random() * 9000) + 1000;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    var mailOptions = {
      from: {
        name: "CGBORG",
        address: process.env.EMAIL
      },
      to: email,
      subject: "Verify email address at Career Guidance Buddy",
      html: `<p>Welcome to Career Guidance Buddy.</p><p> Your OTP is ${otp}. Please use this OTP to verify your email address.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.status(200).json({ otp: otp });
      }
    });
  } catch (error) {
    console.log("Error in send otp controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - JWT token not provided" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);

    user.verified = true;

    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.log("Error in verify controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const forgotPassword = async (req, res) => {
  const url = process.env.REACT_APP_FRONTEND_URL;
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }); // Added await here

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if the user's account is linked with Google, LinkedIn, or Facebook
    if (user.account_type === "google" || user.account_type === "linkedin" || user.account_type === "facebook") {
      return res.status(400).json({ message: "Password reset not allowed for this account type" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
    const resetUrl = `${url}/reset-password/${token}`;
    var mailOptions = {
      from: {
        name: "CGBORG",
        address: process.env.EMAIL
      },
      to: email,
      subject: "Reset Password link for your Career Guidance Buddy account",
      html: `<p>Reset your password by clicking the link below:</p><p>${resetUrl}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ error: error, info: info });
      } else {
        res.status(200).json({ message: "Email Sent" });
      }
    });
  } catch (error) {
    console.log('Error in forgot password controller:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(token);
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decodedToken);

    if (!decodedToken || !decodedToken.id) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Check if the token has expired
    if (Date.now() >= decodedToken.exp * 1000) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    const id = decodedToken.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    return res.json({ status: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.log('Error in reset password controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetch_user_Details = async(req,res)=>{
  
  try {
    // Assuming the user ID is passed as a query parameter
    const userId = req.params.id;
    console.log("user_Id ===> ",userId)
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    const user_Details=await Teacher_Details.findOne({userId:userId})
    //console.log(user)

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({user,user_Details});
} catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}


}

module.exports = {
  login,
  signup,
  logout,
  changePassword,
  sendOtp,
  verify,
  forgotPassword,
  resetPassword,
  fetch_user_Details
};
