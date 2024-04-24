const mongoose = require('mongoose');

const teacherDetailsSchema = new mongoose.Schema(
	{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        country:{
            type:String,
        },
		city:{
			type:String,
		},
        institute:{
            type:String,
        },
		linkedin_profile:{
			type:String,
		},
        facebook_profile:{
            type:String
        },
        instagram_profile:{
			type:String,
		},
        x_profile:{
            type:String
        },
        personal_website:{
			type:String,
		},
		time_zone:{
			type:String,
			default:"Asia/Kolkata"
		},
		about:{
			type:String,
			default:"",
		},
        category:{
            type:String,
        },
        subCategory:[{
            type: String,
        }],

      // Storing multiple languages with proficiency levels
        languages: [{
                language: {
                type: String,
            },
                proficiency: {
                type: String, // 'fluent', 'native', 'conversation'.
            },
        }],

        awards_and_certifications:{
            type:String
        },
        subscription_type:{
            type:String,
            enum:["Community","Premium"]
        },
        access_calendar:{
            type:Boolean,
            default:false,
        }

		// createdAt, updatedAt => Member since <createdAt>
	},
	{ timestamps: true }
);

const Teacher_Details = mongoose.model("Teacher_Details", teacherDetailsSchema);

module.exports = Teacher_Details;