import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";

import {
  FaLock,
  FaUserCircle,
  FaRegEyeSlash,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

import { MdOutlineEmail, MdOutlineRemoveRedEye } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

import logo from "../assets/img/logo.png";
import desktop_user from "../assets/img/user_icon.png"
import desktop_logo from "../assets/img/desktop_logo.svg";
import desktop_lock from "../assets/img/lock_icon.png"
import desktop_email from "../assets/img/email_icon.png"


import bg from "../assets/img/background.png";

import loginText from "../assets/img/text.png";

const apiUrl = process.env.REACT_APP_API_URL;

const SignUp = ({ setMessage, setShowMessage, setProfilePic }) => {
  const location = useLocation();
  const user_type = location.state.user_type;
  Cookies.set("user_type", user_type, { expires: 30 }); // Save user type Teacher or Student

  const initialData = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: user_type,
    agree: true,
    account_type: "custom",
  };

  const [userData, setData] = useState(initialData);
  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);


  async function handleFormSubmit(e) {
    
    // console.log("form submitted")
    e.preventDefault();

    if (userData.agree === false) {
      setShowMessage(true);
      setMessage("Please agree to our terms and conditions to continue.");
      return;
    } 

    try {
      const response = await axios.post(`${apiUrl}/api/auth/signup`, userData);
      console.log(response);
      const userId = response.data._id;
      Cookies.set("loggedInUserId", userId);
      const authToken = response.data.token;
      Cookies.set("authToken", authToken);

      navigate("/verify", { state: { email: userData.email } });
      setShowMessage(true);
      setMessage("Signup successful.");
    } catch (err) {
      setShowMessage(true);
      setMessage(err.response.data.error);
    }
  }
  const googleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
      );
      console.log(response);
      const data = response.data;
      console.log(data);

      try {
        let signup_data = {};

        if (data._id) signup_data.social_id = data._id;

        signup_data.email = data.email ? data.email : "";
        signup_data.picture = data.picture ? data.picture : "";
        signup_data.fullName = data.name ? data.name : "";

        signup_data.verified = true;
        signup_data.account_type = "google";
        signup_data.type = Cookies.get("user_type");

        Cookies.set("account_type", "google");

        const signup_response = await axios.post(
          `${apiUrl}/api/auth/signup`,
          signup_data
        );
        console.log(signup_response);

        if (signup_response.status == 201) {
          setShowMessage(true);
          setMessage("Signup Successful");

          setProfilePic(data.picture);

          Cookies.set("authToken", signup_response.data.token);
          navigate("/edit-profile");
        }
      } catch (err) {
        setShowMessage(true);
        setMessage("Failed to signup. Try again.");
      }
    },
  });

  const { linkedInLogin } = useLinkedIn({
    clientId: "86xbla14dmyrat",
    redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    onSuccess: async (code) => {
      console.log("success");
      const signup_response = await axios.post(`${apiUrl}/api/auth/signup`, {
        linkedin_code: code,
        account_type: "linkedin",
        type: user_type,
      });
      const signup_data = signup_response.data;
      Cookies.set("authToken", signup_data.token);
      navigate("/edit-profile");
    },
    onError: (error) => {
      console.log(error);
    },
    scope: "email,profile,openid",
  });

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
              <h1 className="text-2xl font-medium">Sign Up</h1>
              <p className="text-[15px]">as a {user_type}</p>
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
              Sign Up
              <br />
              <span className="text-[24px]">As a {user_type}</span>
            </h1>
            <div className="px-[29px]">
              <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <div>
                  <label
                    for="name"
                    className="block sm:hidden text-sm font-semibold text-[#585858] pl-4"
                  >
                    Name
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaUserCircle
                        className="sm:hidden w-[20px] h-[20px] text-gray-500"
                        alt=""
                      />
                       <img
                        className="hidden sm:block"
                        src={desktop_user}
                        alt=""
                      />
                    </div>
                    <input
                      type="text"
                      className="pl-10 placeholder:text-gray-500 sm:placeholder:text-orange-500 pr-4 py-3 border border-[#585858] sm:border-orange-500 text-sm w-full rounded-full outline-none"
                      placeholder="Name"
                      required
                      value={userData.fullName}
                      onChange={(e) =>
                        setData({ ...userData, fullName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="email"
                    className="block sm:hidden text-sm font-semibold text-[#585858] pl-4"
                  >
                    Email
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                    <MdOutlineEmail className="sm:hidden w-[15px] h-[20px] text-gray-500" />
                      <img
                        className="hidden sm:block"
                        src={desktop_email}
                        alt=""
                      />
                    </div>
                    <input
                      type="email"
                      required
                      className="pl-10 pr-4 py-3 placeholder:text-gray-500 sm:placeholder:text-orange-500 border border-[#585858] sm:border-orange-500 outline-none text-sm w-full rounded-full"
                      placeholder="Email"
                      value={userData.email}
                      onChange={(e) =>
                        setData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="password"
                    className="block sm:hidden text-sm font-semibold text-[#585858] pl-4"
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaLock
                        className="sm:hidden w-[15px] h-[20px] text-gray-500"
                        alt=""
                      />
                      <img src={desktop_lock} className="hidden sm:block" alt="" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPwd === false ? "password" : "text"}
                      value={userData.password}
                      onChange={(e) =>
                        setData({ ...userData, password: e.target.value })
                      }
                      required
                      className="pl-10 pr-4 py-3 placeholder:text-gray-500 sm:placeholder:text-orange-500 border border-[#585858] sm:border-orange-500 outline-none text-sm w-full rounded-full"
                      placeholder="Password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer">
                      {showPwd === false ? (
                        <FaRegEyeSlash
                          color="#808080"
                          onClick={() => setShowPwd(true)}
                        />
                      ) : (
                        <MdOutlineRemoveRedEye
                          color="#808080"
                          onClick={() => setShowPwd(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    for="password"
                    className="block sm:hidden text-sm font-semibold text-[#585858] pl-4"
                  >
                    Confirm password
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
                      <FaLock
                        className="sm:hidden w-[15px] h-[20px] text-gray-500"
                        alt=""
                      />
                      <img src={desktop_lock} className="hidden sm:block" alt="" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showConfirmPwd === false ? "password" : "text"}
                      value={userData.confirmPassword}
                      onChange={(e) =>
                        setData({
                          ...userData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="pl-10 pr-4 py-3 placeholder:text-gray-500 sm:placeholder:text-orange-500 border border-[#585858] sm:border-orange-500 outline-none text-sm w-full rounded-full"
                      placeholder="Confirm Password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer">
                      {showConfirmPwd === false ? (
                        <FaRegEyeSlash
                          color="#808080"
                          onClick={() => setShowConfirmPwd(true)}
                        />
                      ) : (
                        <MdOutlineRemoveRedEye
                          color="#808080"
                          onClick={() => setShowConfirmPwd(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className=" pt-0.5">
                  <div className="flex flex-row gap-1 w-full justify-center mx-2">
                    <div className="basis-1/12 ">
                      <input
                        type="checkbox"
                        name="agree"
                        id="agree"
                        checked={userData.agree}
                        onChange={(e) =>
                          setData({ ...userData, agree: e.target.checked })
                        }
                      />
                    </div>
                    <div className="basis-11/12 text-[12px]">
                      By signing in, you agree to our
                      <Link to="">terms and conditions</Link> and the
                      <Link to=""> privacy policy</Link>.
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    // type="submit"
                    className="px-6 py-2 text-white w-10/12 sm:w-full bg-gradient-to-b from-[#ff6535] via-[#ff9e48] to-[#ffce58] rounded-full drop-shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <div className="sm:flex flex-col-reverse sm:mt-8 gap-8">
                <div className="flex sm:hidden w-full justify-center pt-0.5">
                  <p className="font-normal text-sm">-or-</p>
                </div>
                <div className="flex items-center justify-center pt-5">
                  <div className="mr-5">
                    <FaFacebook
                      size={35}
                      className="cursor-pointer"
                      color={"#0866ff"}
                    />
                  </div>

                  <div>
                    <FcGoogle
                      size={35}
                      className="cursor-pointer"
                      onClick={() => googleSignUp()}
                    />
                  </div>

                  <div className="ml-5">
                    <FaLinkedin
                      onClick={linkedInLogin}
                      size={35}
                      className="cursor-pointer"
                      color={"#0075b5"}
                    />
                  </div>
                </div>
                <div>
                  <p className="my-2 sm:my-0 text-sm text-[#585858] sm:text-[#2D2D2D] sm:font-medium flex items-center justify-center text-center">
                    Already have an account?
                    <Link to="/">
                      <img src={loginText} alt="" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
