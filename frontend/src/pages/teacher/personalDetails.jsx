import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import countries from "../../utils/countries";
import time_zones from "../../utils/timezones";

import arrowIcon from "../../assets/img/Vectoryy.png";
import uploadIcon from "../../assets/img/upload.png";
import lockIcon from "../../assets/img/block.png";
import { MdVerifiedUser } from "react-icons/md";

const PersonalDetails = ({ formData, setFormData, handleChange, setSelectedFile }) => {
  const account_type = Cookies.get("account_type");
  
  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const chooseFile = () => {
    document.getElementById("file_input").click();
  };

  async function get_cities() {
    try {
      let response = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: formData.country,
      });
      set_cities(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const [cities, set_cities] = useState([]);

  const city = cities.map((city) => {
    return <option key={city} value={city}>{city}</option>;
  });

  return (
    <div>
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 px-[16px]">
        {/* Full Name Input */}
        <div className="sm:col-span-6">
          <label htmlFor="full-name" className="block text-sm font-semibold leading-6 text-gradient pl-[14px]">
            Full Name *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="fullName"
              autoComplete="given-name"
              className="block w-full rounded-m border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.fullName}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="sm:col-span-6">
          <div className="flex justify-between">
            <label htmlFor="email" className="text-sm font-semibold leading-6 text-gradient pl-[14px]">
              Email address *
            </label>
            <div className="flex text-gradient text-[14px] font-semibold">
              {formData.verified ? (
                <>
                  <div className="mr-2">Verified</div>
                  <MdVerifiedUser color="orange" size={18} />
                </>
              ) : (
                <Link to="/verify" state={{ email: formData.email }}>Verify now</Link>
              )}
            </div>
          </div>
          <div className="mt-2">
            <input
              name="email"
              type="email"
              disabled
              value={formData.email}
              autoComplete="email"
              className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        {/* Access Calendar Checkbox */}
        <div className="flex ml-2 mt-2 gap-1 text-gradient w-60">
          <input
            type="checkbox"
            className=""
            checked={formData.access_calendar}
            onChange={(e) => handleChange(e)}
            name="access_calendar"
          />
          <div className="text-sm font-semibold leading-6 pl-[14px]">Access Google Calendar</div>
        </div>

        {/* Country and City Inputs */}
        <div className="sm:col-span-6">
          <div className="flex items-center justify-between flex-col min-[375px]:flex-row ">
            <div className="sm:col-span-3 w-[100%] sm:w-[50%] mr-2">
              <label htmlFor="country" className="block text-sm font-semibold leading-6 text-gradient pl-[14px]">
                Country *
              </label>
              <div className="mt-2 relative">
                <input
                  name="country"
                  type="text"
                  key="country"
                  autoComplete="country-name"
                  list="countries"
                  className="appearance-none w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                  value={formData.country}
                  onChange={(e) => handleChange(e)}
                />
                <datalist id="countries">{countries}</datalist>
              </div>
            </div>
            <div className="sm:col-span-3 w-[100%] sm:w-[50%]">
              <label htmlFor="city" className="text-sm font-semibold leading-6 text-gradient pl-[14px]">
                City
              </label>
              <div className="mt-2 relative">
                <input
                  name="city"
                  type="text"
                  list="cities"
                  autoComplete="city-name"
                  className="appearance-none w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                  value={formData.city}
                  onChange={(e) => {
                    handleChange(e);
                    get_cities();
                  }}
                />
                <datalist id="cities">{city}</datalist>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Profile Input */}
        <div className="sm:col-span-6">
          <label htmlFor="linkedin_profile" className="text-sm font-semibold leading-6 text-gradient pl-[14px]">
            LinkedIn profile
          </label>
          <div className="mt-2">
            <input
              name="linkedin_profile"
              type="url"
              autoComplete="url"
              className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.linkedin_profile}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        {/* Time Zone Select */}
        <div className="sm:col-span-6">
          <label htmlFor="time_zone" className="text-sm font-semibold leading-6 text-gradient pl-[14px]">
            Time Zone *
          </label>
          <div className="mt-2 relative">
            <select
              name="time_zone"
              className="w-full appearance-none border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.time_zone}
              onChange={(e) => handleChange(e)}
            >
              {time_zones}
            </select>
            <img src={arrowIcon} alt="" className="absolute top-[18px] right-[18px]" />
          </div>
        </div>

        {/* About Input */}
        <div className="sm:col-span-6 mb-3">
          <label htmlFor="about" className="text-sm font-semibold leading-6 text-gradient pl-[14px]">
            About *
          </label>
          <div className="mt-2">
            <textarea
              name="about"
              className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.about}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>
        </div>
      </form>

      <hr className="h-px mb-[15px] mx-[15px] bg-[#E2E2E2] border-0 dark:bg-gray-700 opacity-25" />

      <div style={{ display: account_type !== "custom" ? "none" : "flex" }} className="flex items-center justify-center mb-4 pb-10">
        <Link to="/change-password" className="flex shadow-md text-white py-2 px-3 rounded-full items-center justify-center mr-2 bg-gradient">
          <span className="mr-2">
            <img src={lockIcon} alt="" />
          </span>
          <span className="text-[11px]">Change Password</span>
        </Link>
        <div className="relative flex w-[160px]">
          <input className="w-[100px] ml-3 mt-1" type="file" accept="image/*" id="file_input" name="profilePic" onChange={handleFileUpload} />
          <button onClick={chooseFile} className="absolute flex shadow-md text-white py-2 px-3 rounded-full items-center justify-center bg-gradient">
            <span className="mr-2">
              <img src={uploadIcon} alt="" />
            </span>
            <span className="text-[11px]">Upload Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
