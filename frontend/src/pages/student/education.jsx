import { useState, useEffect } from "react";
import axios from "axios";

import SelectedLanguages from "../../components/selectedLanguages";
import RelocateAreas from "../../components/relocateAreas";

import saveIcon from "../../assets/img/tick.png";
import arrowIcon from "../../assets/img/Vectoryy.png";

const apiUrl = process.env.REACT_APP_API_URL;

const Education = ({ formData, setFormData, handleChange, submitForm }) => {
  const [categories, set_categories] = useState([]);
  const [subCategories, set_subCategories] = useState([]);
  const [interest_subCategories, set_interest_subCategories] = useState([]);

  async function get_subCategories(category) {
    try {
      let response = await axios.post(
        `${apiUrl}/api/subCategories/getParticularSubCategory`,
        { category_name: category }
      );
      let data = response.data;
      let subcategories = [];

      for (let sc of data) {
        subcategories.push(sc.name);
      }

      console.log(subcategories);
      set_subCategories(subcategories);
    } catch (err) {
      console.log(err);
    }
  }

  async function get_interest_subCategories(category) {
    try {
      let response = await axios.post(
        `${apiUrl}/api/subCategories/getParticularSubCategory`,
        { category_name: category }
      );
      let data = response.data;
      let interest_subcategories = [];

      for (let sc of data) {
        interest_subcategories.push(sc.name);
      }

      console.log(interest_subCategories);
      set_interest_subCategories(interest_subcategories);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSubCategory(e) {
    let updatedData = { ...formData };
    let field_name = e.target.getAttribute("field_name");

    if (e.target.checked) {
      updatedData[field_name].push(e.target.value);
    } else {
      const index = updatedData[field_name].indexOf(e.target.value);
      if (index > -1) {
        // only splice array when item is found
        updatedData[field_name].splice(index, 1);
      }
    }
    setFormData({ ...updatedData });
  }

  let subCategory =
    formData.category === "" || formData.category === undefined
      ? ""
      : subCategories.map((subcategory) => {
          return (
            <>
              <label class="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  value={subcategory}
                  name={subcategory}
                  field_name="subCategory"
                  class="form-checkbox h-4 w-4 text-indigo-600"
                  checked={formData.subCategory.includes(subcategory)}
                  onChange={handleSubCategory}
                />
                <span class="ml-1 text-gray-700">{subcategory}</span>
              </label>
            </>
          );
        });

  let interest_subCategory =
    formData.interest_category === "" ||
    formData.interest_category === undefined
      ? ""
      : interest_subCategories.map((subcategory) => {
          return (
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                value={subcategory}
                name={subcategory}
                field_name="interest_subCategory"
                class="form-checkbox h-4 w-4 text-indigo-600 mr-2"
                checked={formData.interest_subCategory.includes(subcategory)}
                onChange={handleSubCategory}
              />
              <span class="ml-1 text-gray-700">{subcategory}</span>
            </label>
          );
        });

  useEffect(() => {
    get_categories();
    if (formData.category != "") {
      get_subCategories(formData.category);
    }

    if (formData.interest_category != "") {
      get_interest_subCategories(formData.interest_category);
    }
  }, []);

  async function get_categories() {
    let response = await fetch(`${apiUrl}/api/categories/getAllCategory`);
    let data = await response.json();

    let categories = [];

    for (let c of data) categories.push(c.name);

    set_categories(categories);
  }

  const category = categories.map((category) => {
    return (
      <>
        <option value={category}>{category}</option>
      </>
    );
  });

  return (
    <div class="education" id="education">
      <form class="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 sm:px-4" onSubmit={submitForm}>
        <div class="col-span-6 text-sm">
          <label
            for="category"
            class="block font-semibold leading-6 text-gradient"
          >
            Currently Pursuing
          </label>

          <div class="flex flex-col sm:flex-row sm:w-full justify-between">
            <div class="w-full mt-2 relative mr-4">
              <select
                type="text"
                name="category"
                default="Select a category"
                class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-4 py-3 appearance-none"
                value={formData.category}
                onChange={(e) => {
                  setFormData({...formData,category:e.target.value})
                  get_subCategories(e.target.value)
                    // ,subCategory:category_data[`${e.target.value}`]
                }}
              >
                <option value="" selected disabled>
                  Select a course
                </option>
                {/* <!-- Categories options here --> */}
                {category}
              </select>
              <img
                src={arrowIcon}
                alt=""
                class="absolute top-[18px] right-[18px]"
              />
            </div>
          </div>
        </div>

        <div class="col-span-6 text-sm">
          <div class="font-semibold leading-6 text-gradient">
            Select subcategories you are pursuing
          </div>
          <div class="flex gap-2 flex-wrap items-center gap-1">
            {subCategory}
          </div>
        </div>

        <div class="col-span-6 text-sm">
          <label
            for="interest_category"
            class="block font-semibold leading-6 text-gradient"
          >
            Courses Interested
          </label>

          <div class="flex flex-col sm:flex-row justify-between">
            <div class="mt-2 relative w-full mr-4">
              <select
                name="interest_category"
                autoComplete="category-name"
                class="appearance-none w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-4 py-3"
                value={formData.interest_category}
                onChange={(e) =>  {
                  get_interest_subCategories(e.target.value)
                  setFormData({...formData,interest_category:e.target.value})
                  
                    // ,interest_subCategory:category_data[`${e.target.value}`]
                }
                }
              >
                <option value="" selected disabled>
                  Select a course
                </option>
                {category}
              </select>
              <img
                src={arrowIcon}
                alt=""
                class="absolute top-[18px] right-[18px]"
              />
            </div>
          </div>
        </div>
        {/* <!-- sub categoried checkbox will open when any category is selected --> */}
        <div class="col-span-6 text-sm">
          <div class="font-semibold leading-6 text-gradient mb-2">
            Select subcategories you are interested in
          </div>
          <div class="flex flex-wrap items-center gap-1">
            {/* <!-- Interest subcategories checkboxes here --> */}
            {interest_subCategory}
          </div>
        </div>

        <div class="col-span-6 text-sm sm:flex items-center mt-4">
          <label
            for="radio-btn"
            class="block font-semibold leading-6 text-gradient pl-4"
          >
            Willing to relocate:
          </label>
          <div class="flex mt-2 sm:mt-0">
            <div class="flex pl-4 text-[#afafaf]">
              <span class="mr-2">Yes</span>
              <input
                name="willing_to_relocate"
                type="radio"
                value="yes"
                class="w-5 h-5 border-gradient"
                checked="checked"
                onChange={()=>{setFormData({...formData,willing_to_relocate:true})}}
              />
            </div>

            <div class="flex pl-7 text-[#afafaf]">
              <div class="mr-2">No</div>
              <input
                name="willing_to_relocate"
                type="radio"
                value="no"
                class="w-5 h-5 border-gradient"
                onChange={()=>{setFormData({...formData,willing_to_relocate:false,preferred_locations:[]})}}
              />
            </div>
          </div>
        </div>

        <div
          className="sm:col-span-6 text-[14px]"
          style={{
            display: formData.willing_to_relocate === true ? "block" : "none",
          }}
        >
          <RelocateAreas formData={formData} setFormData={setFormData} />
        </div>

        <div className="sm:col-span-6 text-[14px]">
          <SelectedLanguages formData={formData} setFormData={setFormData} />
        </div>


        <div class="flex col-span-6 items-center justify-center mb-4 sm:mt-3">
          <button class="flex shadow-md text-white py-2 px-3 rounded-full items-center justify-center mr-2 bg-gradient sm:w-full max-w-[200px] sm:max-w-[268px]">
            <span class="mr-2">
              <img src={saveIcon} />
            </span>
            <span class="text-xs">Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Education;
