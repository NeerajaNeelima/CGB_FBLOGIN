const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email:{
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minlength: 6,
		},
		gender: {
			type: String,
			// required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
		},
		online: {
			type: Boolean,
			default: false
		},
		verified:{
			type: Boolean,
			default: false
		},
		type:{
			type:String,
			enum:["Student","Teacher"]
		},
		account_type:{
			type:String,
			enum:["custom","google","facebook","linkedin"],
			default:"custom"

		},
		social_id:{
			type:String
		},
		referralCode: { type: String, 
			unique: true, 
			sparse: true }, 
		referredBy: { type: mongoose.Schema.Types.ObjectId, 
			ref: 'User' 
		},
		rating:{
            type:Number,
			default:0
        },
		
	},
	{ timestamps: true }
);

const User = mongoose.model(
	"User", userSchema);

module.exports = User;