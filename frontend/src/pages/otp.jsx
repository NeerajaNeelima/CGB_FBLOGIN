import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import logo from "../assets/img/logo.png";
import desktop_logo from "../assets/img/desktop_logo.svg";
import background from "../assets/img/background.png";

const apiUrl = process.env.REACT_APP_API_URL;

const Otp = ({ setMessage, setShowMessage }) => {

  const location = useLocation();
  const email = location.state.email;
  const [correctOtp, setCorrectOtp] = useState("");
  const authToken = Cookies.get("authToken")

  const sendOtp = async () => {
    console.log("sending otp");
    let body = { email: email };
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/send-otp`,
        body
      );
      let correctOtp = response.data.otp;

      setCorrectOtp(correctOtp);
    } catch (err) {
      setShowMessage(true);
      setMessage("Error occured. Could not send otp!");
    }
  };

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerify, setVerify] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyUp = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      // Move focus to the previous input field if Backspace is pressed
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (index < otp.length - 1 && otp[index].length === 1) {
      // Move focus to the next input field if a digit is entered
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.join("") === correctOtp.toString()) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/auth/verify`,{
            headers:{
              Authorization:`Bearer ${authToken}`
            }
          }
        );
        setShowMessage(true);
        setMessage("Email address verified successfully!");
      } catch (err) {
        setShowMessage(true);
        setMessage("Sorry! Could not verify email address");
      }
      navigate("/edit-profile");
    } else {
      setShowMessage(true);
      setMessage("OTP is incorrect");
    }
  };

  return (
    <section class="sm:h-[100vh] sm:w-full sm:flex items-center justify-center sm:px-5">
    <div class="sm:grid grid-cols-2 sm:h-[688px] sm:mx-auto max-w-2xl sm:max-w-[1080px] sm:shadow-md sm:rounded-[50px]">
      <div class="sm:hidden bg-cover bg-right-bottom bg-no-repeat h-[320px] sm:mx-auto sm:w-full sm:max-w-md"
        style={{ backgroundImage: `url(${background})`, width: '100%' }}>
        <div class="pl-9 pt-16 max-w-[433px]">
          <img class="w-[189px]" src={logo} alt="logo" />
          <div class="pt-4 text-white">
            <h1 class="text-2xl font-medium">Verify email address</h1>
          </div>
        </div>
      </div>

      <div class="bg-gradient sm:h-full hidden sm:flex flex-col justify-center items-center sm:rounded-s-[50px]">
        <div class="flex justify-center items-center mx-auto w-full">
          <img src={logo} alt="logo" class="sm:hidden pt-5 w-6/12"/>
          <img src={desktop_logo} alt="logo" class="hidden sm:block w-10/12"/>
        </div>
        <div class="pt-4 sm:pt-[50px] md:pt-[100px] lg:pt-[136px]">
          <h3 class="text-center text-white text-lg md:text-2xl font-semibold">
            Start your journey to the
          </h3>
          <h3 class="text-center text-white text-lg md:text-2xl font-semibold pb-6">
            world of learning.
          </h3>
        </div>
      </div>

      <div class=" mt-[135px] sm:mt-0 sm:flex sm:flex-col items-center justify-center" id="msg" style={{display:isVerify?"none":"flex"}}>
        <h1 class="hidden sm:block text-[40px] mb-8 font-semibold text-gradient text-center">Verify Email</h1>
        <div
          class="flex sm:flex-col sm:shadow-md sm:rounded-[25px] sm:h-[400px] sm:w-10/12 items-center gap-4 sm:gap-10 justify-evenly sm:justify-center text-[15px] sm:text-[24px] sm:text-center text-[#afafaf] w-[349px] mx-auto px-3 sm:px-0">
          <div class="w-[234px] sm:w-11/12">
            <p class="w-full">When you click on the verify button, you will receive an OTP that
              will help us to verify your email address.</p>
          </div>
          <button
            class="bg-gradient text-white text-[17px] font-medium rounded-full px-[29px] py-[14px] justify-end cursor-pointer"
            onClick={() => {
                sendOtp();
                setVerify(true);
              }}
            >
            Verify
          </button>
        </div>
      </div>
      <div class="hidden mt-[55px] sm:mt-0 items-center justify-center mx-auto" id="otp" style={{display:isVerify?"flex":"none"}}>
        <div>
          <h1 class="hidden sm:block text-[40px] mb-8 font-semibold text-gradient text-center">Verify Email</h1>
          <div
            class="sm:flex sm:flex-col sm:shadow-md sm:rounded-[25px] sm:h-[400px] sm:w-10/12 items-center gap-4 sm:gap-10 justify-evenly sm:justify-center text-[15px] lg:text-[24px] sm:text-center text-[#afafaf] mx-auto px-5">
            <div class="mb-7 sm:mb-5 flex justify-center">
              <p class="text-[#afafaf] sm:leading-[25px]">We have sent an OTP to pqr@gmail.com. Please enter it below to
                verify your email address.</p>
            </div>
            <div class="mb-5 sm:mb-3 mr-0 flex gap-3 justify-center">
            {otp.map((digit, index) => {
                return (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyUp={(e) => handleKeyUp(index, e)}
              className="w-[48px] md:w-[64px] text-center px-3 py-3 border border-[#afafaf] border-1 rounded-xl"
            />
                )
            })}
            </div>
            <div class="absolute sm:static bottom-10 left-0 right-0 justify-between gap-[88px] sm:gap-5 md:gap-8 px-3 hidden" style={{display:isVerify?"flex":"none"}}
              id="submit-btn">
              <button class="bg-slate-300 px-4 md:px-10 py-2 text-[#585858] rounded-full ml-5 sm:ml-0">
                Cancel
              </button>

              <button 
              class="bg-gradient px-4 md:px-10 py-2 text-white rounded-full mr-4 sm:mr-0"
              onClick={handleOtpSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Otp;
