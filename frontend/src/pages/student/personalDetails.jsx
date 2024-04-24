import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import countries from "../../utils/countries";
import time_zones from "../../utils/timezones";

import arrowIcon from "../../assets/img/Vectoryy.png";
import uploadIcon from "../../assets/img/upload.png";
import lockIcon from "../../assets/img/block.png";
import { MdVerifiedUser } from "react-icons/md";

const PersonalDetails = ({
  formData,
  setFormData,
  handleChange,
  setSelectedFile,
}) => {
  const account_type = Cookies.get("account_type");
  console.log(account_type);

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log(reader.result);
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function get_cities() {
    try {
      let response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: formData.country }
      );
      set_cities(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const [cities, set_cities] = useState([]);

  const city = cities.map((city) => {
    return (
      <option key={city} value={city}>
        {city}
      </option>
    );
  });

  const chooseFile = () => {
    document.getElementById("file_input").click();
  };

  return (
    <>
    <div id="personal">
      <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 px-2">
        <div class="sm:col-span-6">
          <label
            for="full-name"
            class="block text-sm font-semibold leading-2 text-gradient pl-[14px]"
          >
            Full Name *
          </label>
          <div class="mt-2">
            <input
              type="text"
              name="fullName"
              autoComplete="given-name"
              class="block w-full rounded-m border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.fullName}
              onChange={(e) => handleChange(e) }
            />
          </div>
        </div>

        <div class="sm:col-span-6">
          <div class="flex justify-between">
            <label
              for="email"
              class="text-sm font-semibold leading-2 text-gradient pl-[14px]"
            >
              Email address *
            </label>
            <div class="flex text-gradient text-[14px] font-semibold">
            { formData.verified ? (
                      <>
                      <div className="mr-2">Verified</div> 
                      <MdVerifiedUser color="orange" size={18}/>
                      </>
                      )
                      : (
                      <Link to="/verify" state={{email:formData.email}}> Verify now </Link>
                      )}
            </div>
          </div>
          <div class="mt-2">
            <input
              name="email"
              type="email"
              disabled
              autoComplete="email"
              class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.email}
              onChange={(e) => handleChange(e) }
            />
          </div>
        </div>
        <div className="flex ml-2 mt-2 gap-1 text-gradient w-60">
                
                <input
                  type="checkbox"
                  className=""
                  checked={formData.access_calender}
                  onChange={(e) => handleChange(e)}
                  name="access_calender"
                />
                <div className="text-sm font-semibold leading-6 pl-[14px]">Access Google Calender</div>
          </div>

        <div class="sm:col-span-6">
          <div class="flex items-center justify-between flex-col min-[375px]:flex-row">
            <div class="sm:col-span-3 w-[100%] sm:w-[50%] mr-2">
              <label
                for="country"
                class="block text-sm font-semibold leading-2 text-gradient pl-[14px]"
              >
                Country *
              </label>
              <div class="mt-2 relative">
                <input
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  list="countries"
                  class="appearance-none w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                  value={formData.country}
                      onChange={(e)=>handleChange(e)}
                />
                <datalist id="countries">
                    {countries}
                </datalist>
              </div>
            </div>
            <div class="sm:col-span-3 w-[100%] sm:w-[50%]">
              <label
                for="city"
                class="text-sm font-semibold leading-2 text-gradient pl-[14px]"
              >
                City
              </label>
              <div class="mt-2 relative">
                <input
                  name="city"
                  type="text"
                  list="cities"
                  autoComplete="city-name"
                  class="appearance-none w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                  value={formData.city}
                  onChange={(e) => {
                    handleChange(e)
                    get_cities()
                  }}
                />
                <datalist id="cities">
                    {cities}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:col-span-6">
          <label
            for="linkedin_profile"
            class="text-sm font-semibold leading-2 text-gradient pl-[14px]"
          >
            LinkedIn profile
          </label>
          <div class="mt-2">
            <input
              name="linkedin_profile"
              type="url"
              autoComplete="url"
              class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.linkedin_profile}
                    onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div class="sm:col-span-6">
          <label
            for="time_zone"
            class="text-sm font-semibold leading-2 text-gradient pl-[14px]"
          >
            Time Zone *
          </label>
          <div class="mt-2 relative">
            <select
              name="time_zone"
              class="w-full appearance-none border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.time_zone}
                    onChange={(e) => handleChange(e)}
            >
              <option value="">Select Time Zone</option>
              {time_zones}
            </select>
            <img
              src={arrowIcon}
              alt=""
              class="absolute top-[18px] right-[18px]"
            />
          </div>
        </div>

        <div class="sm:col-span-6 mb-1">
          <label
            for="about"
            class="text-sm font-semibold leading-2 text-gradient pl-[14px]"
          >
            About *
          </label>
          <div class="mt-2">
            <textarea
              name="about"
              class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
              value={formData.about}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>
        </div>
      </div>

      <hr class="h-px my-4 sm:my-10 mx-[15px] border-0 dark:bg-gray-700 opacity-25" />

      <div style={{display:account_type !== "custom" ? "none" : "grid" }}
      class="flex flex-wrap sm:grid grid-cols-2 gap-5 sm:gap-10 sm:w-8/12 mx-auto sm:mx-none sm:w-full items-center justify-center mb-1">
        <Link to="/change-password"
          class="flex w-full shadow-md text-white py-2 px-3 rounded-full items-center justify-center mr-2 bg-gradient"
        >
          <img src={lockIcon} alt="" class="mr-2" />
          <span class="text-[11px]">Change Password</span>
        </Link>
        <div class="relative flex items-center w-full">
          <input
            class="w-[100px] ml-3 mt-1"
            type="file"
            accept="image/*"
            id="file_input"
            name="profilePic"
            onChange={handleFileUpload}
          />
          <button class="absolute w-full flex shadow-md text-white py-2 px-3 rounded-full items-center justify-center bg-gradient"
          onClick={chooseFile}
          >
            <img src={uploadIcon} alt="" class="mr-2" />
            <span class="text-[11px]">Upload Profile Picture</span>
          </button>
        </div>
      </div>
      </div> 
    </>
  );
};

export default PersonalDetails;
