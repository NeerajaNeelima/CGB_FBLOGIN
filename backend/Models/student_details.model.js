const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema(
	{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
		country:{
			type: String,
			
		},
		city:{
			type:String,
			
		},
		linkedin_profile:{
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
        interest_category:{
            type:String,
        },
        interest_subCategory:[{
            type: String,
        }],
        willing_to_relocate:{
            type:Boolean,
            default:false,
        },
        // Storing multiple preferred countries and cities as arrays
        preferred_locations:[{
            country: {
            type: String,
        },
            city: [{
            type: String,
        }],
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
        access_calendar:{
            type:Boolean,
            default:false,
        },

		// createdAt, updatedAt => Member since <createdAt>
	},
	{ timestamps: true }
);

const Student_Details = mongoose.model("Student_Details", studentDetailsSchema);

module.exports = Student_Details;