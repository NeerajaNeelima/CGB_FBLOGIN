import { useState,useEffect } from "react";
import axios from "axios"
import SelectedLanguages from "../../components/selectedLanguages";

import saveIcon from "../../assets/img/tick.png";
import arrowIcon from "../../assets/img/Vectoryy.png";

const apiUrl = process.env.REACT_APP_API_URL;


const Profession = ({ formData, setFormData, handleChange, submitForm }) => {

  const [categories,set_categories] = useState([])
  const [subCategories,set_subCategories] = useState([])


  useEffect(()=>{
    get_categories()

    if(formData.category!=""){
    get_subCategories(formData.category)
    }
    
 },[])

  async function get_categories(){

  let response = await fetch(`${apiUrl}/api/categories/getAllCategory`)
  let data = await response.json()

  let categories = [];

    for(let c of data)
    categories.push(c.name)

    set_categories(categories)

 }

 const category = categories.map((category)=>{
    return (
      <>
      <option value={category}>{category}</option>
      </>
    )
  })

  async function get_subCategories(category){
    try{
    let response = await axios.post(`${apiUrl}/api/subCategories/getParticularSubCategory`,{"category_name":category})
    let data = response.data
    let subcategories = []

    for (let sc of data){
    subcategories.push(sc.name)
    }

    console.log(subcategories)
    set_subCategories(subcategories)

    }
    catch(err){
      console.log(err)
    }
  }


  function handleSubCategory(e,index) {
    let updatedData = {...formData};
    let field_name = e.target.getAttribute("field_name")

    if (e.target.checked) {
      updatedData[field_name].push(e.target.value);
    } else {
      const index = updatedData[field_name].indexOf(e.target.value);
      if (index > -1) {
        // only splice array when item is found
        updatedData[field_name].splice(index, 1);
      }
    }
    setFormData(updatedData);
  }

  let subCategory =
    ((formData.category === "") || (formData.category === undefined))
      ? ""
      : subCategories.map((subcategory,index) => {
          return (
            <>
              <div className="flex mr-2 mt-2 text-[#afafaf]">
                <div className="mr-2">{subcategory}</div>
                <input
                  type="checkbox"
                  value={subcategory}
                  name={subcategory}
                  field_name="subCategory"
                  checked={formData.subCategory.includes(subcategory)}
                  onChange={(e) => handleSubCategory(e,index)}
                />
              </div>
            </>
          );
        });

  return (
    <div>
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 px-[16px]" onSubmit={submitForm}>

      <div className="sm:col-span-6 mb-3">

        <label
          htmlFor="institute"
          className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
          >Institute associated with *
        </label>

        <div className="mt-2">
          <input
            type="text"
            name="institute"
            className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
            value={formData.institute}
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        </div>

        <div className="sm:col-span-6 text-[14px]">
          <label
            htmlFor="category"
            className="block font-semibold leading-6 text-gradient pl-[14px]"
          >
            Expert in category *
          </label>

          <div className="flex flex-col min-[375px]:flex-row justify-between">
            <div className="w-[100%] sm:w-[50%] mt-2 relative mr-[14px]">
              <select
                type="text"
                name="category"
                defaultValue="Select a category"
                className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px] appearance-none"
                value={formData.category}
                onChange={(e) => {
                  setFormData({...formData,category:e.target.value})
                  get_subCategories(e.target.value)
                }}
              >
                <option value="" selected disabled>
                  Select a course
                </option>

                {category}
              </select>
              <img
                src={arrowIcon}
                alt=""
                className="absolute top-[18px] right-[18px]"
              />
            </div>
          </div>
        </div>

    { formData.category!="" ? (
        <div className="sm:col-span-6 text-[14px] mb-3">
          <div className="font-semibold leading-6 text-gradient pl-[14px]">Select subcategories you are expert in</div>
          <div className="px-3 flex flex-wrap items-center">
            {subCategory}
          </div>
        </div>
        ) : ""
    }

      <div className="sm:col-span-6 mb-3">

        <label
          htmlFor="awards_and_certifications"
          className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
          >Awards_and_certfifications (if any)
        </label>

        <div className="mt-2">
          <textarea
            name="awards_and_certifications"
            className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
            value={formData.awards_and_certifications}
            onChange={(e) => handleChange(e)}
          ></textarea>
        </div>
      </div>

      <div className="sm:col-span-6">
                <label
                  htmlFor="instagram_profile"
                  className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
                  >Instagram profile
                  </label>
                <div className="mt-2">
                  <input
                    name="instagram_profile"
                    type="url"
                    autoComplete="url"
                    className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={formData.instagram_profile}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="facebook_profile"
                  className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
                  >Facebook profile
                  </label>
                <div className="mt-2">
                  <input
                    name="facebook_profile"
                    type="url"
                    autoComplete="url"
                    className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={formData.facebook_profile}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="x_profile"
                  className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
                  >X profile
                  </label>
                <div className="mt-2">
                  <input
                    name="x_profile"
                    type="url"
                    autoComplete="url"
                    className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={formData.x_profile}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="personal_website"
                  className="text-sm font-semibold leading-6 text-gradient pl-[14px]"
                  >Personal_website
                  </label>
                <div className="mt-2">
                  <input
                    name="personal_website"
                    type="url"
                    autoComplete="url"
                    className="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={formData.personal_website}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

        <div className="sm:col-span-6 text-[14px]">
          <SelectedLanguages formData={formData} setFormData={setFormData} />
        </div>

      <div className="flex items-center justify-center mb-[30px] pb-6">

        <button
          className="flex shadow-md text-white py-2 px-3 rounded-full items-center justify-center mr-2 bg-gradient"
        >
          <span className="mr-2">
            <img src={saveIcon}alt=""/>
          </span>
          <span className="text-[11px]">Save and Subscribe</span>
        </button>

      </div>
      </form>

    </div>
  );
};

export default Profession;
