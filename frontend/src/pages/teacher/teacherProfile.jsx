import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import PersonalDetails from "./personalDetails";
import Profession from "./profession";

import bg from "../../assets/img/background-2.png";
import logo from "../../assets/img/logo.png";
import { TbLogout } from "react-icons/tb";

const apiUrl = process.env.REACT_APP_API_URL;

const TeacherProfile = ({setMessage,setShowMessage,profilePic}) => {

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("Personal details");
    const authToken = Cookies.get("authToken"); // Access the authToken from cookie

const initialFormData = {
  fullName: "",
  email: "",
  country:"",
  city:"",
  verified: false,
  time_zone: "",
  linkedin_profile: "",
  instagram_profile:"",
  facebook_profile:"",
  x_profile:"",
  personal_website:"",
  about: "",
  institute:"",
  awards_and_certificates:"",
  category: "",
  subCategory: [],
  languages: [
    // {
    //   language:"",
    //   proficiency:""
    // }
  ],
  profilePic: "",
  access_calendar:false,
};

const [formData, setFormData] = useState(initialFormData);
const [selectedFile, setSelectedFile] = useState(null);
const defaultProfile = `${apiUrl}/uploads/profile-pictures/user.png`


useEffect(() => {
  getProfileData();
}, []);

async function getProfileData() {
  {
    try {
      const response = await axios.get(
        `${apiUrl}/api/teacher/get-teacher-details`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = response.data;
      const teacher = data.teacher;
      const teacher_details = data.teacherDetails;

      //Auto-fill fields

      if (teacher_details) {
        const {
          country,
          city,
          time_zone,
          linkedin_profile,
          instagram_profile,
          facebook_profile,
          x_profile,
          personal_website,
          about,
          institute,
          awards_and_certifications,
          category,
          subCategory,
          interest_category,
          interest_subCategory,
          willing_to_relocate,
          preferred_locations,
          languages,
          access_calendar,
        } = teacher_details;

        setFormData({
        ...formData,
        email: teacher.email,
        fullName: teacher.fullName,
        verified: teacher.verified,
        profilePic: teacher.profilePic,
        country:country,
        city:city,
        time_zone: time_zone,
        about: about,
        institute:institute,
        instagram_profile:instagram_profile,
        facebook_profile:facebook_profile,
        x_profile: x_profile,
        personal_website:personal_website,
        awards_and_certifications:awards_and_certifications,
        category: category,
        subCategory: subCategory,
        interest_category: interest_category,
        interest_subCategory: interest_subCategory,
        languages: languages,
        willing_to_relocate: willing_to_relocate,
        preferred_locations: preferred_locations,
        linkedin_profile: linkedin_profile,
        access_calendar:access_calendar,
        });
      } else {
        setFormData({
          ...formData,
          email: teacher.email,
          fullName: teacher.fullName,
          verified: teacher.verified,
          profilePic: teacher.profilePic,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const handleChange = (e) => {
  const target = e.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  //console.log("handleChange:", name, value);
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

async function submitForm(e) {

  e.preventDefault()

  // some validations before submitting the data
  if (
    formData.fullName === "" ||
    formData.time_zone === "" ||
    formData.about === "" ||
    formData.institute === ""
  ) {
    
    setShowMessage(true);
    setMessage("Please fill in the mandatory fields.");
    return;
  } 
  // else if (
  //   subCategory.length !== 0 && formData.subCategory.length === 0 ) {
  //   setShowMessage(true);
  //   setMessage("Please choose atleast one subcategory.");
  //   return;
  // } 
  else if (formData.languages.length === 0) {
    setShowMessage(true);
    setMessage("Please add atleast one language.");
    return;
  } 

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend[`${key}`]=value;
  });

  try {
    let response = await axios.post(
      `${apiUrl}/api/teacher/edit-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
         },
      }
    );
    setShowMessage(true);
    //console.log(formData)
    setMessage("Profile updated successfully!");
    navigate("/cabinet")
  } catch (err) {
    console.log(err)
    setShowMessage(true);
    setMessage(err.response.data.error);
  }
}

const handleLogout = async () => {
  try {

    // Make a request to the backend logout endpoint with the token in the headers
    const response = await axios.post(
      `${apiUrl}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      }
    );

    // Handle successful logout response
    setShowMessage(true);
    setMessage("Logged out successfully");
    Cookies.remove("loggedInUserId");
    Cookies.remove("authToken");
    Cookies.remove("account_type");
    Cookies.remove("user_type")
    navigate("/"); // Redirect to the login page or any other appropriate page
  } catch (error) {
    // Handle logout error
    console.error("Error logging out:", error);
  }
};
return (
  <>
    <div>
      <div
        className="bg-contain bg-no-repeat w-full h-[280px] sm:mx-auto sm:w-full sm:max-w-md"
        style={{ backgroundImage: `url("${bg}")` }}
      >
        <div className="flex justify-center items-center pt-[52px]">
          <img src={logo} alt="logo" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="mt-[-120px] flex flex-col">
          <div className="flex flex-col justify-center items-center mb-4">
            {selectedFile != null ? (
              <img
                src={selectedFile}
                alt="Profile"
                className="rounded-full max-h-[75px]"
                height={75}
                width={75}
              />
            ) : (
                      <img src={`${profilePic!==""?profilePic:defaultProfile}`}
                      alt="Profile"
                      className="rounded-full max-h-[75px]"
                      height={75}
                      width={75}
                      />
                )
            }
            <h1 className="font-semibold text-2xl text-[#585858]">{formData.fullName}</h1>
            <p className="text-[#afafaf] text-sm font-normal">Teacher</p>
          </div>

          <div className="flex items-center justify-center px-[15px] mt-4 pb-[30px] shadow-md rounded-b-full">
            <button
              onClick={() => setCurrentPage("Personal details")}
              className={
                currentPage === "Personal details"
                  ? "shadow-md text-white py-2 px-4 rounded-full mr-3 bg-gradient"
                  : "shadow-md text-white py-2 px-4 rounded-full mr-3 text-gradient"
              }
            >
              Personal details
            </button>

            <button
              className={
                currentPage === "Profession"
                  ? "shadow-md text-white py-2 px-4 rounded-full mr-3 bg-gradient"
                  : "shadow-md text-white py-2 px-4 rounded-full mr-3 text-gradient"
              }
              onClick={() => setCurrentPage("Profession")}
            >
              Profession
            </button>

            <button onClick={handleLogout}>
              <TbLogout color="#afafaf" size={25}/>
            </button>
          </div>
        </div>
      </div>
    </div>

    {currentPage === "Personal details" ? (
      <PersonalDetails
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        setSelectedFile={setSelectedFile}
      />
    ) : (
      <Profession
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        submitForm={submitForm}
      />
    )}
    </>
  )
}

export default TeacherProfile;
