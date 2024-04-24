import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import PersonalDetails from "./personalDetails";
import Education from "./education";

import bg from "../../assets/img/background-2.png";
import logo from "../../assets/img/logo.png";
import { TbLogout } from "react-icons/tb";
import NavTeacher from "../../components/nav/navTeacher";

const apiUrl = process.env.REACT_APP_API_URL;

const StudentProfile = ({ setMessage, setShowMessage, profilePic }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("Personal details");
  const authToken = Cookies.get("authToken"); // Access the authToken from cookie
  const defaultProfile = `${apiUrl}/uploads/profile-pictures/user.png`;

  const initialFormData = {
    fullName: "",
    email: "",
    verified: false,
    country: "",
    city: "",
    time_zone: "",
    linkedin_profile: "",
    about: "",
    category: "",
    subCategory: [],
    interest_category: "",
    interest_subCategory: [],
    willing_to_relocate: "no",
    access_google_calendar : "yes",
    preferred_locations: [
      // {
      //   country:'',
      //   city:[]
      // }
    ],
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

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    {
      try {
        let response = await axios.get(
          `${apiUrl}/api/student/get-student-details`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const student = response.data.student;
        const student_details = response.data.studentDetails;

        //Auto-fill fields

        if (student_details) {
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
            access_calendar,
          } = student_details;

          setFormData({
            ...formData,
            email: student.email,
            fullName: student.fullName,
            verified: student.verified,
            profilePic: student.profilePic,
            country: country,
            city: city,
            time_zone: time_zone,
            about: about,
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
            email: student.email,
            fullName: student.fullName,
            verified: student.verified,
            profilePic: student.profilePic,
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
    e.preventDefault();
    console.log(formData);

    // some validations before submitting the data
    if (
      formData.fullName === "" ||
      formData.time_zone === "" ||
      formData.about === "" ||
      formData.country === "" ||
      formData.category === ""
    ) {
      setShowMessage(true);
      setMessage("Please fill in the mandatory fields.");
      return;
    }
    // else if (
    //   formData.subCategory.length === 0 ||
    //   formData.interest_subCategory.length === 0
    // ) {
    //   setShowMessage(true);
    //   setMessage("Please choose atleast one subcategory.");
    //   return;
    // }
    else if (formData.languages.length === 0) {
      setShowMessage(true);
      setMessage("Please add atleast one language.");
      return;
    } else if (
      formData.willing_to_relocate &&
      formData.preferred_locations.length === 0
    ) {
      setShowMessage(true);
      setMessage(
        "Please add atleast one preferred area of relocation if you are willing to relocate."
      );
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend[`${key}`] = value;
    });

    try {
      let response = await axios.post(
        `${apiUrl}/api/student/edit-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowMessage(true);
      setMessage("Profile updated successfully!");
      navigate("/cabinet");
    } catch (err) {
      console.log(err);
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
      Cookies.remove("user_type");
      Cookies.remove("account_type");
      navigate("/"); // Redirect to the login page or any other appropriate page
    } catch (error) {
      // Handle logout error
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
    <NavTeacher/>
      <div class="sm:mx-auto sm:w-full sm:max-w-[1296px] sm:px-5">
        <div>
          <div
            class="sm:hidden bg-contain bg-cover bg-no-repeat w-full h-[280px] sm:mx-auto sm:w-full sm:max-w-md"
            style={{ backgroundImage: `url("${bg}")` }}
          >
            <div class="flex justify-center items-center pt-[52px]">
              <img class="w-[189px]" src={logo} alt="logo" />
            </div>
          </div>
          <div class="flex flex-col items-center mt-16 sm:mt-0 sm:px-5 w-full">
            <div class="mt-[-130px] sm:mt-10 md:mt-20 flex flex-col w-full md:grid grid-cols-3 gap-10 sm:min-h-[85vh] sm:py-[55px] justify-center">
              <div class="w-full mx-auto h-fit p-[15px] sm:p-9 shadow-md rounded-[25px] sm:border border-orange-500">
                <div class="hidden sm:flex flex-col justify-center items-center ">
                  {selectedFile != null ? (
                    <img
                      src={selectedFile}
                      alt="Profile"
                      className="rounded-full max-h-[75px]"
                      height={75}
                      width={75}
                    />
                  ) : (
                    <img
                      src={`${profilePic !== "" ? profilePic : defaultProfile}`}
                      alt="Profile"
                      className="rounded-full max-h-[75px]"
                      height={75}
                      width={75}
                    />
                  )}
                  <h1 class="font-semibold text-2xl text-[#585858]">
                    {formData.fullName}
                  </h1>
                  <p class="text-[#afafaf] text-sm font-normal">Student</p>
                </div>
                <div class="flex flex-wrap sm:flex-col gap-4 items-center justify-center mt-4">
                  <button
                    onClick={() => setCurrentPage("Personal details")}
                    class={
                      currentPage === "Personal details"
                        ? "shadow-md text-white sm:w-full text-center py-2 px-4 rounded-full bg-gradient"
                        : "shadow-md text-white sm:w-full text-center py-2 px-4 rounded-full text-gradient"
                    }
                  >
                    Personal Details
                  </button>
                  <button
                    onClick={() => setCurrentPage("Education")}
                    class={
                      currentPage === "Education"
                        ? "shadow-md text-white sm:w-full text-center py-2 px-4 rounded-full bg-gradient"
                        : "shadow-md text-white sm:w-full text-center py-2 px-4 rounded-full text-gradient"
                    }
                  >
                    Education
                  </button>

                  {/* <button onClick={handleLogout}>
                <TbLogout color="#afafaf" size={25}/>
              </button> */}
                </div>
              </div>
            
            <div class="col-span-2 overflow-y-auto grid grid-cols-1 gap-x-2 gap-y-4 p-2 sm:p-5 sm:shadow-md h-fit rounded-[25px]">
              <h1 class="hidden sm:block text-gradient font-semibold text-xl">
                Edit Profile
              </h1>
              {currentPage === "Personal details" ? (
                <PersonalDetails
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  setSelectedFile={setSelectedFile}
                />
              ) : (
                <Education
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  submitForm={submitForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

    </>
  );
};

export default StudentProfile;
