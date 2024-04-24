const Student_Details = require("../../Models/student_details.model");
const Teacher_Details = require("../../Models/teacher_details.model");
const User = require("../../Models/user.model");

const Get_Student_Details = async (req, res) => {
  try {
    const student = req.user;
    const userId = student._id;

    const studentDetails = await Student_Details.findOne({ userId });

    res.status(200).json({ student, studentDetails });
  } catch (error) {
    console.log("Error in get student details controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Edit_Profile = async (req, res) => {
  try {
    const student = req.user;
    const userId = student._id;

    // Update user profile
    const { fullName, email } = req.body;
    if (fullName) student.fullName = fullName;
    if (email) student.email = email;

    // save path of profile pic in db
    if (req.file !== undefined)
      student.profilePic = "profile-pictures/" + req.file.path.split("\\")[2];

    // Save the updated user
    await student.save();

    // Find or create Student_Details document
    let studentDetails = await Student_Details.findOne({ userId });

    if (!studentDetails) {
      studentDetails = new Student_Details({ userId });
    }

    // Update Student_Details fields
    const {
      country,
      city,
      time_zone,
      linkedin_profile,
      about,
      category,
      subCategory,
      interest_category,
      interest_subCategory,
      willing_to_relocate,
      preferred_locations,
      languages,
      access_calendar
    } = req.body;

    studentDetails.country = country;
    studentDetails.city = city;
    studentDetails.linkedin_profile = linkedin_profile;
    studentDetails.time_zone = time_zone;
    studentDetails.about = about;
    studentDetails.category = category;
    studentDetails.subCategory = subCategory;
    studentDetails.interest_category = interest_category;
    studentDetails.interest_subCategory = interest_subCategory;
    studentDetails.willing_to_relocate = willing_to_relocate;
    studentDetails.preferred_locations = preferred_locations;
    studentDetails.languages = languages;
    studentDetails.access_calendar=access_calendar

    // Save the updated Student_Details
    await studentDetails.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in edit controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Search_Student = async (req, res) => {
  try {
    let teacher = req.user;
    console.log("==> teacher = ", teacher);
    const { name, country, city, category, subCategory,interest_category,interest_subCategory } = req.query;
    let query = {};
    if (country) query.country = { $regex: new RegExp(country, "i") };
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (category) query.category = category;
    if (subCategory)
      query.subCategory =  { subCategory: { $in: [subCategory] } };
    if (interest_category) query.interest_category = interest_category;
    if (interest_subCategory)
      query.interest_subCategory =  { interest_subCategory: { $in: [interest_subCategory] } };
    console.log("==> query = ", query);
    let users_list = await Student_Details.find(query);
    console.log("==> user list = ", users_list);
    // Convert Mongoose documents to plain JavaScript objects
    users_list = users_list.map((user) => user.toObject());
    for (let i = 0; i < users_list.length; i++) {
      let userId = users_list[i].userId;
      console.log(userId)
      let user = await User.findOne({ _id: userId });
      users_list[i].fullName = user.fullName;
      users_list[i].profilePic = user.profilePic;
    }
    if (name) {
      users_list = users_list.filter((user) =>
        user.fullName.toLowerCase().includes(name.toLowerCase())
      );
    }

    console.log(users_list);

    let current_user_details = await Teacher_Details.findOne({
      userId: teacher._id,
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
  Get_Student_Details,
  Search_Student,
  getAllCountry,
  getAllCity,
};
