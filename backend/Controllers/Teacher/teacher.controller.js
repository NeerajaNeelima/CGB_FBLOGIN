const Teacher_Details = require("../../Models/teacher_details.model");
const Student_Details = require("../../Models/student_details.model");
const User = require("../../Models/user.model");

const Get_Teacher_Details = async (req, res) => {
  try {
    const teacher = req.user;
    const userId = teacher._id;

    const teacherDetails = await Teacher_Details.findOne({ userId });

    res.status(200).json({ teacher, teacherDetails });
  } catch (error) {
    console.log("Error in get teacher details controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Edit_Profile = async (req, res) => {
  try {
    const teacher = req.user;
    const userId = teacher._id;

    // Update user profile
    const { fullName, email } = req.body;
    if (fullName) teacher.fullName = fullName;
    if (email) teacher.email = email;

    // save the profile picture path in db
    if (req.file !== undefined)
      teacher.profilePic = "profile-pictures/" + req.file.path.split("\\")[2];

    // Save the updated user
    await teacher.save();

    // Find or create Student_Details document
    let teacherDetails = await Teacher_Details.findOne({ userId });

    if (!teacherDetails) {
      teacherDetails = new Teacher_Details({ userId });
    }

    // Update Student_Details fields
    const {
      country,
      city,
      time_zone,
      linkedin_profile,
      instagram_profile,
      facebook_profile,
      x_profile,
      personal_website,
      institute,
      awards_and_certifications,
      about,
      category,
      subCategory,
      languages,
      access_calendar
    } = req.body;

    teacherDetails.country = country;
    teacherDetails.city = city;
    teacherDetails.linkedin_profile = linkedin_profile;
    teacherDetails.instagram_profile = instagram_profile;
    teacherDetails.facebook_profile = facebook_profile;
    teacherDetails.x_profile = x_profile;
    teacherDetails.personal_website = personal_website;
    teacherDetails.institute = institute;
    teacherDetails.awards_and_certifications = awards_and_certifications;
    teacherDetails.time_zone = time_zone;
    teacherDetails.about = about;
    teacherDetails.category = category;
    teacherDetails.subCategory = subCategory;
    teacherDetails.languages = languages;
    teacherDetails.access_calendar=access_calendar

    // Save the updated Student_Details
    await teacherDetails.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", teacherDetails });
  } catch (error) {
    console.log("Error in edit controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Search_Teacher = async (req, res) => {
  try {
    let student = req.user;
    // console.log("==> student = ", student);
    const { name, institute, country, city, category, subCategory } = req.query;

    let query = {};

    if (institute) query.institute = { $regex: new RegExp(institute, "i") };
    if (country) query.country = { $regex: new RegExp(country, "i") };
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (category) query.category = category;
    if (subCategory)
      query.subCategory =  { subCategory: { $in: [subCategory] } };

    // console.log("==> query = ", query);

    let users_list = await Teacher_Details.find(query);

    // console.log("==> user list = ", users_list);

    // Convert Mongoose documents to plain JavaScript objects
    users_list = users_list.map((user) => user.toObject());

    for (let i = 0; i < users_list.length; i++) {
      let userId = users_list[i].userId;
      let user = await User.findOne({ _id: userId });
      users_list[i].fullName = user.fullName;
      users_list[i].profilePic = user.profilePic;
    }

    if (name) {
      users_list = users_list.filter((user) =>
        user.fullName.toLowerCase().includes(name.toLowerCase())
      );
    }

    console.log("searched user details :",users_list);

    let current_user_details = await Student_Details.findOne({
      userId: student._id,
    });

    if (current_user_details != null) {
      let interest_category = current_user_details.interest_category;
      let interest_subCategory = current_user_details.interest_subCategory;

      // Sort the array based on the "category" key
      users_list.sort((a, b) => {
        // Sort interest_category objects to come first
        if (
          a.category === interest_category &&
          b.category !== interest_category
        ) {
          return -1;
        } else if (
          a.category !== interest_category &&
          b.category === interest_category
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    // Sort the array based on the "subCategory" key
    // search_list.sort((a, b) => {
    //   // Sort interest_category objects to come first
    //   if (interest_subCategory.includes(a.subCategory) && !interest_subCategory.includes(b.subCategory)) {
    //       return -1;
    //   } else if (!interest_subCategory.includes(a.category) && interest_subCategory.includes(b.category)) {
    //       return 1;
    //   } else {
    //       return 0;
    //   }
    // });

    res.status(200).json({ message: "Search successful", users_list });
  } catch (error) {
    console.log("Error in search controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCountry = async (req, res) => {
  try {
    const countries = await Student_Details.find().distinct("country");
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCity = async (req, res) => {
  try {
    const cities = await Student_Details.find().distinct("city");
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  Edit_Profile,
  Get_Teacher_Details,
  Search_Teacher,
  getAllCountry,
  getAllCity,
};
