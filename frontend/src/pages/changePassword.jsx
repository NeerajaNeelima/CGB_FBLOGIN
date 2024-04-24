import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Cookies from "js-cookie"; // Import js-cookie

import logo from "../assets/img/logo.png";
import desktop_logo from "../assets/img/desktop_logo.svg";
import bg from "../assets/img/background.png";

const apiUrl = process.env.REACT_APP_API_URL;

const ChangePassword = ({ setMessage, setShowMessage }) => {
  const initialData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [userData, setData] = useState(initialData);
  const navigate = useNavigate();

  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const authToken = Cookies.get("authToken"); // Access the authToken from cookie
  const user_type = Cookies.get("user_type");

  async function handleChangePassword() {
    console.log(userData);

    try {
      let body = userData;
      console.log(body);

      let response = await axios.post(
        `${apiUrl}/api/auth/change-password`,
        body,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setShowMessage(true);
      setMessage("Password Changed Successfully.");
      navigate("/edit-profile");
    } catch (err) {
      setShowMessage(true);
      setMessage(err.response.data.error);
    }
  }

  return (
    <section className="sm:h-[100vh] sm:w-full sm:flex items-center justify-center sm:px-5">
      <div className="sm:grid grid-cols-2 sm:h-[688px] sm:mx-auto max-w-2xl sm:max-w-[1080px] sm:shadow-md sm:rounded-[50px]">
        <div
          className="sm:hidden bg-cover bg-right-bottom bg-no-repeat h-[320px] sm:mx-auto sm:w-full sm:max-w-md"
          style={{ backgroundImage: `url("${bg}")` }}
        >
          <div className="pl-9 pt-16 max-w-[433px]">
            <img className="w-[189px]" src={logo} alt="logo" />
            <div className="pt-4 text-white">
              <h1 className="text-2xl font-medium">Change Password</h1>
            </div>
          </div>
        </div>

        <div className="bg-gradient sm:h-full hidden sm:flex flex-col justify-center items-center sm:rounded-s-[50px]">
          <div className="flex justify-center items-center mx-auto w-full">
            <img src={logo} alt="logo" className="sm:hidden pt-5 w-6/12" />
            <img
              src={desktop_logo}
              alt="logo"
              className="hidden sm:block w-10/12"
            />
          </div>
          <div className="pt-4 sm:pt-[50px] md:pt-[100px] lg:pt-[136px]">
            <h3 className="text-center text-white text-lg md:text-2xl font-semibold">
              Start your journey to the
            </h3>
            <h3 className="text-center text-white text-lg md:text-2xl font-semibold pb-6">
              world of learning.
            </h3>
          </div>
        </div>

        <div className="p-3 w-full sm:h-full sm:flex items-center justify-center">
          <div className="mx-auto w-full max-w-[480px] md:max-w-auto sm:w-full lg:w-10/12 mt-[40px] sm:mt-0">
            <h1 className="hidden sm:block text-[40px] mb-6 font-semibold text-center text-gradient leading-[40px]">
              Change Password
            </h1>
            <div className="px-[29px]">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="old_password"
                    className="block text-sm font-semibold text-[#585858] pl-4"
                  >
                    Old password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="old_password"
                      name="old_password"
                      type={showOldPwd === false ? "password":"text"}
                    value={userData.currentPassword}
                    onChange={(e)=>setData({...userData,currentPassword:e.target.value})}
                      required
                      className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
                    />
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaLock color="#808080"/>
                    </div>

                    <div className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer">
                    {
                      showOldPwd === false ? (
                        <FaRegEyeSlash color="#808080" onClick={()=>setShowOldPwd(true)}/>
                      ) : (
                        <MdOutlineRemoveRedEye color="#808080" onClick={()=>setShowOldPwd(false)}/>
                      )
                    }
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#585858] pl-4"
                  >
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPwd === false ? "password":"text" }
                    value={userData.newPassword}
                    onChange={(e)=>setData({...userData,newPassword:e.target.value})}
                      required
                      className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
                    />
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaLock color="#808080"/>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer">
                    {
                      showPwd === false ? (
                        <FaRegEyeSlash color="#808080" onClick={()=>setShowPwd(true)}/>
                      ) : (
                        <MdOutlineRemoveRedEye color="#808080" onClick={()=>setShowPwd(false)}/>
                      )
                    }
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-semibold text-[#585858] pl-4"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPwd === false ? "password":"text"}
                    value={userData.confirmPassword}
                    onChange={(e)=>setData({...userData,confirmPassword:e.target.value})}
                      required
                      className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
                    />
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaLock color="#808080"/>
                    </div>

                    <div className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer">
                    {
                      showConfirmPwd === false ? (
                        <FaRegEyeSlash color="#808080" onClick={()=>setShowConfirmPwd(true)}/>
                      ) : (
                        <MdOutlineRemoveRedEye color="#808080" onClick={()=>setShowConfirmPwd(false)}/>
                      )
                    }
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="flex w-[273px] justify-center rounded-full text-white p-[10px] bg-gradient"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
