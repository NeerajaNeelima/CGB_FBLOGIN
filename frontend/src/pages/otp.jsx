import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"

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
  const [otp, setOtp] = useState(["", "", "", ""]);
  const authToken = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    console.log("sending otp");
    let body = { email: email };
    try {
      const response = await axios.post(`${apiUrl}/api/auth/send-otp`, body);
      let correctOtp = response.data.otp;
      setCorrectOtp(correctOtp);
    } catch (err) {
      setShowMessage(true);
      setMessage("Error occurred. Could not send otp!");
    }
  };

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyUp = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (index < otp.length - 1 && otp[index].length === 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.join("") === correctOtp.toString()) {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setShowMessage(true);
        setMessage("Email address verified successfully!");
        navigate("/cabinet");
      } catch (err) {
        setShowMessage(true);
        setMessage("Sorry! Could not verify email address");
        navigate("/signup");
      }
      
    } else {
      setShowMessage(true);
      setMessage("OTP is incorrect");
    }
  };


  return (
    <section className="sm:h-[100vh] sm:w-full sm:flex items-center justify-center sm:px-5">
    <div className="sm:grid grid-cols-2 sm:h-[688px] sm:mx-auto max-w-2xl sm:max-w-[1080px] sm:shadow-md sm:rounded-[50px]">
      <div className="sm:hidden bg-cover bg-right-bottom bg-no-repeat h-[320px] sm:mx-auto sm:w-full sm:max-w-md"
        style={{ backgroundImage: `url(${background})`, width: '100%' }}>
        <div className="pl-9 pt-16 max-w-[433px]">
          <img className="w-[189px]" src={logo} alt="logo" />
          <div className="pt-4 text-white">
            <h1 className="text-2xl font-medium">Verify email address</h1>
          </div>
        </div>
      </div>

      <div className="bg-gradient sm:h-full hidden sm:flex flex-col justify-center items-center sm:rounded-s-[50px]">
        <div className="flex justify-center items-center mx-auto w-full">
          <img src={logo} alt="logo" className="sm:hidden pt-5 w-6/12"/>
          <img src={desktop_logo} alt="logo" className="hidden sm:block w-10/12"/>
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

      {/* OTP input section */}
      <div className=" mt-[-50px] sm:mt-20 items-center justify-center mx-auto" id="otp">
          <div>
            <h1 className=" sm:block text-[40px] mb-8 font-semibold text-gradient text-center">Verify Email</h1>
            <div className="sm:flex sm:flex-col sm:shadow-md sm:rounded-[25px] sm:h-[400px] sm:w-10/12 items-center gap-4 sm:gap-10 justify-evenly sm:justify-center text-[15px] lg:text-[24px] sm:text-center text-[#afafaf] mx-auto px-5">
              <div className="mb-7 sm:mb-5 flex justify-center">
                <p className="text-[#afafaf] sm:leading-[25px]">We have sent an OTP to {email}. Please enter it below to verify your email address.</p>
              </div>
              <div className="mb-5 sm:mb-3 mr-0 flex gap-3 justify-center">
                {otp.map((digit, index) => (
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
                ))}
              </div>
              <div className="flex justify-center mt-10 gap-[88px] sm:gap-5 md:gap-8 px-3" id="submit-btn">
                <button onClick={() => window.history.back()} className="bg-slate-300 px-4 md:px-10 py-2 text-[#585858] rounded-full ml-5 sm:ml-0">
                  Cancel
                </button>
                <button className="bg-gradient px-4 md:px-10 py-2 text-white rounded-full mr-4 sm:mr-0" onClick={handleOtpSubmit}>
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
