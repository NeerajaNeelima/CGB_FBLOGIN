
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import MainMenu from "../components/MenuBottom/MainMenu";

//import ProfileModal from "../Modals/ProfileModal";

import bg from "../assets/img/background-2.png";
import logo from "../assets/img/logo.png";
import { TbLogout } from "react-icons/tb";

import { MdEmojiEmotions } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import NavTeacher from "../components/nav/navTeacher";

const Cabinet = ({ profilePic }) => {
  console.log(profilePic);
  const apiUrl = process.env.REACT_APP_API_URL;

  let initialProfileData = {
    display: "none",
    about: "",
    profilePic: "",
    rating: "",
    id:"",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [profileData, setProfileData] = useState(initialProfileData);

  const navigate = useNavigate();
  let authToken = Cookies.get("authToken");
  let user_type = Cookies.get("user_type");
  let search = user_type === "Student" ? "Teacher" : "Student";

  let defaultProfile = `${apiUrl}/uploads/profile-pictures/user.png`;

  useEffect(() => {
    findUsers();
  }, []);


  const handleUser =() =>{
    console.log("clicked")
  }
  const suggestedUsers = users.map((user) => {
    return (
      <>
        <div
          onClick={() => {
            // setOpacity(0.3)
            setProfileData({
              ...profileData,
              display: "block",
              id:user.userId,
              profilePic:
                user.profilePic !== "" && user.profilePic !== undefined
                  ? user.profilePic
                  : defaultProfile,
              about: user.about,
            });
            
          }}
          className="flex flex-row justify-between shadow-md rounded-full mx-[6px] pl-[10px] py-[10px] px-4 relative z-5 mb-2"
        >
          <div className="flex items-center  gap-2  " onClick={handleUser}>
            <img
              src={
                user.profilePic !== "" && user.profilePic !== undefined
                  ? user.profilePic
                  : defaultProfile
              }
              alt="Profile photo"
              width={50}
              height={50}
            />
            <div className="">
              <h1 className="font-semibold text-[#585858] text-sm sm:text-base">
                {user.fullName}
              </h1>
              <p className="font-normal text-[11px] sm:text-[15px] text-[#585858]">
                {user.about.length > 80 ? (
                  <>{user.about.slice(0, 80) + ".."}</>
                ) : (
                  <>{user.about}</>
                )}
              </p>
            </div>
          </div>
          {user_type === "Student" ? (
            <div className="ml-auto flex flex-col justify-center items-center">
              <MdEmojiEmotions color="orange" size={20} />
              <p className="font-medium text-[15px] text-gradient">5.0</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  });

  const findUsers = async () => {
    let response;

    if (user_type === "Teacher") {
      response = await axios.get(
        `${apiUrl}/api/student/search?name=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } else {
      response = await axios.get(
        `${apiUrl}/api/teacher/search?name=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    }

    setUsers(response.data.users_list);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    findUsers();
  };

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

      // // Handle successful logout response
      // setShowMessage(true);
      // setMessage("Logged out successfully");

      Cookies.remove("loggedInUserId");
      Cookies.remove("authToken");
      Cookies.remove("user_type");
      navigate("/"); // Redirect to the login page or any other appropriate page
    } catch (error) {
      // Handle logout error
      console.error("Error logging out:", error);
    }
  };


  return (
    <>
      <section className="mb-20 sm:mb-0">
        <NavTeacher/>
        <div className="">
          <div
            className="sm:hidden bg-contain bg-cover bg-no-repeat w-full h-[280px] sm:mx-auto sm:w-full"
            style={{ backgroundImage: `url("${bg}")` }}
          >
            <div className="flex justify-center items-center pt-[52px]">
              <img className="w-[189px]" src={logo} alt="logo" />
            </div>
          </div>

            {/* popup component 
             <ProfileModal profileData={profileData} setProfileData={setProfileData}/>*/}

          <div className="sm:mx-auto sm:w-full sm:max-w-[1296px] sm:px-5 mb-8">
            {/* <!-- component --> */}
            <div className="mt-[-80px] sm:mt-0 md:grid grid-cols-3 gap-4 sm:min-h-[85vh] sm:py-[55px]">
              <div className="h-full sm:rounded-[25px] sm:shadow-md min-h-full sm:flex justify-center items-start pt-5 sm:pb-5 md:pb-0">
                <div className="sm:rounded-[50px] sm:shadow-md sm:w-7/12 md:w-11/12 sm:border-2 sm:h-[352px] sm:border-orange-500 sm:flex flex-col items-center justify-center sm:px-3 lg:px-8">
                  <div className="flex flex-col justify-center items-center mb-4">
                    <img
                      src={
                        profilePic !== "" && profilePic !== undefined
                          ? profilePic
                          : defaultProfile
                      }
                      height={75}
                      width={75}
                      alt="Profile Picture"
                      className="rounded-full"
                    />
                    <h1 className="font-semibold text-2xl text-[#585858]">Name</h1>
                    <p className="text-[#afafaf] text-sm font-normal">{user_type}</p>
                  </div>
                  <div className="sm:flex items-center justify-center sm:w-full px-8 sm:px-0">
                    <Link
                      to="/search"
                      className="mr-3 sm:mr-0 bg-gradient text-center rounded-full text-white py-2 px-4 w-full"
                    >
                      Go to detailed search
                    </Link>

                    {/* <button onClick={handleLogout}>
                      <TbLogout color="#afafaf" size={25} />
                    </button> */}

                  </div>
                  <div className="flex flex-row gap-2 items-center justify-center mt-4 pb-9 shadow-md px-8 sm:px-0 sm:shadow-none rounded-b-[50px] sm:rounded-b-none w-full">
                    <form onSubmit={handleSearch} className="w-full">
                      <div>
                        <div className="relative mt-1 ">
                          <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                            <IoMdSearch color="#afafaf" size={20} />
                          </div>
                          <input
                            type="text"
                            className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
                            placeholder={`Search by ${search}'s name`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mr-3 bg-gradient rounded-full text-white py-3 px-4 w-2/12 sm:w-4/12"
                      >
                        Go
                      </button>
                    </form>

                    {/* <button>
                      <FaBell color="#afafaf" size={25} />
                    </button> */}

                  </div>
                </div>
              </div>
              <div className="px-3 col-span-2 sm:h-full sm:rounded-[25px] sm:shadow-md min-h-full">
                <h1 className="mt-5 mb-4 font-semibold text-[#585858] text-sm sm:text-xl pl-5">
                  Suggested for you:
                </h1>
                <div>
                 {suggestedUsers}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- menu component --> */}
      <div className="hidden lg:block">
      <MainMenu/>
      </div>
        
    </>
  );
};

export default Cabinet;
