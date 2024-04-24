const bcrypt = require("bcryptjs");
const User = require("../../Models/user.model.js");
const generateTokenAndSetCookie = require("../../Utils/generateToken.js");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios')

/* --------------- Login Functionality --------------------- */

const login = async (req, res) => {
    try {
        const { email, social_id, password, account_type,linkedin_code } = req.body;
        let user;
		let picture;
        switch (account_type) {
            case "custom":
                user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ error: "User not registered" });
                }
                const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
                if (!isPasswordCorrect) {
                    return res.status(400).json({ error: "Invalid email or password" });
                }
                break;
            case "google":
                user = await User.findOne({ email:email });
                if (!user) {
                    return res.status(400).json({ error: "User not registered" });
                }
                break;
            case "linkedin":
				const response = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedin_code}&client_id=86xbla14dmyrat&client_secret=pT3cAYOH2EWt8NF1&redirect_uri=http://localhost:3000/linkedin`,{
					headers:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				})
				const accessToken = response.data.access_token;

				const user_response = await axios.get("https://api.linkedin.com/v2/userinfo",{
					headers:{
						Authorization:`Bearer ${accessToken}`
					}
				})
				const user_data = user_response.data;
				picture = user_data.picture;
            	user = await User.findOne({ email:user_data.email });
                if (!user) {
                    return res.status(400).json({ error: "User not registered" });
                }
				
                break;
            case "facebook":
                user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ error: "User not registered" });
                }
        }


		console.log(user)
        const token = generateTokenAndSetCookie(user._id, res);

        // Update user's online status to true
        await User.findByIdAndUpdate(user._id, { online: true });
        const userDetails = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic||picture,
            online: user.online,
            type: user.type,
			account_type,
            token
        };
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
		const { fullName, email, social_id, password, confirmPassword, account_type, type, linkedin_code } = req.body;
		
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
					type
				});
				break;
			case "google":
				newUser = new User({
					email,
					fullName,
					account_type,
					verified: true,
					type
				});
				break;
			case "linkedin":
			try{
				console.log("linkedin")
		    	const response = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedin_code}&client_id=86xbla14dmyrat&client_secret=pT3cAYOH2EWt8NF1&redirect_uri=http://localhost:3000/linkedin`,{
					headers:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				})
				const accessToken = response.data.access_token;

				const user_response = await axios.get("https://api.linkedin.com/v2/userinfo",{
					headers:{
						Authorization:`Bearer ${accessToken}`
					}
				})
				const user_data = user_response.data;

				newUser = new User({
					email:user_data.email,
					fullName:user_data.name,
					account_type,
					verified: user_data.email_verified,
					type
				});
			}
			catch(error){
				console.log(error)
				res.status(500).json({ error: "Failed to signup. Please try again." });
				return;
			}
				break;
			case "facebook":
				newUser = new User({
					social_id,
					fullName,
					account_type,
					verified: true,
					type
				});
		}

		// Generate JWT token here
		const token = generateTokenAndSetCookie(newUser._id, res);
		await newUser.save();

		res.status(201).json({
			_id: newUser._id,
			email: newUser.email,
			token
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}


const logout = async (req, res) => {
	try {

		const token = req.headers.authorization;
		console.log(token)

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - JWT token not provided" });
		}

		const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const userId = decoded.userId;

		const user = await User.findById(userId);

		await User.findByIdAndUpdate(userId, { online: false });
		console.log(user)
		res.status(200).json({
			message: "Logged out successfully",
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				profilePic: user.profilePic,
				online: false,
			}
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
		return res.status(500).json({ error: "Password and Confirm Password does not match" })
	}
	//console.log(id)
	try {
		// Find the admin by ID
		const token = req.headers.authorization;
		console.log(token)

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - JWT token not provided" });
		}

		const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const userId = decoded.userId;

		const user = await User.findById(userId);

		console.log(user)
		if (!user || !user.password) {
			return res.status(401).json({ error: 'User or password not found' });
		}

		// Compare current password
		const passwordMatch = await bcrypt.compare(currentPassword, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: 'Current password is incorrect' });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password
		user.password = hashedPassword;
		await User.findByIdAndUpdate(userId, { password: hashedPassword });

		res.status(200).json({ message: 'Password changed successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

const sendOtp = async (req, res) => {
	try {
		const { email } = req.body;
		const otp = Math.floor(Math.random() * 9000) + 1000;

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		});

		var mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: 'Verify email address at Career Guidance Buddy',
			html: `<p>Welcome to Career Guidance Buddy. Your OTP is ${otp}. Please use this OTP to verify your email address.</p>`
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
		console.log(token)

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - JWT token not provided" });
		}

		const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const userId = decoded.userId;

		const user = await User.findById(userId);

		user.verified = true;

		await user.save();

		res.status(200).json({ message: "User verified successfully" });

	}
	catch (error) {
		console.log("Error in verify controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

module.exports = {
	login,
	signup,
	logout,
	changePassword,
	sendOtp,
	verify
};