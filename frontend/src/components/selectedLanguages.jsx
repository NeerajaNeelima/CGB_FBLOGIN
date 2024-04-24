import React from "react";
import languages from "../utils/languages";
import arrowIcon from "../assets/img/Vectoryy.png";
import { MdOutlineCancel } from "react-icons/md";

const SelectedLanguages = ({ formData, setFormData }) => {
  const handleLanguageChange = (index, key, value) => {
    const newLanguages = [...formData.languages];
    newLanguages[index][key] = value;
    setFormData({ ...formData, languages: newLanguages });
  };

  const handleLanguageAdd = (language) => {
    const newLanguages = [
      ...formData.languages,
      { language: language, proficiency: "" },
    ];
    setFormData({ ...formData, languages: newLanguages });
  };

  const handleLanguageRemove = (index) => {
    const newLanguages = [
      ...formData.languages.slice(0, index),
      ...formData.languages.slice(index + 1),
    ];
    setFormData({ ...formData, languages: newLanguages });
  };

  return (
    <>
      <div class="col-span-6 text-s sm:mt-2">
        <label
          htmlFor="languages"
          class="block font-semibold leading-6 text-gradient"
        >
          Languages Known *
        </label>
        <div class="mt-2 relative w-[100%]">
          <select
            id="languages"
            name="languages"
            type="languages"
            onChange={(e) => handleLanguageAdd(e.target.value)}
            class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px] appearance-none"
          >
            <option selected disabled value="">
              Select a language
            </option>
            {languages}
          </select>

          <img
            src={arrowIcon}
            alt=""
            class="absolute top-[18px] right-[18px]"
          />
        </div>

        <div
          id="selected_languages"
          class="mt-2 flex sm:justify-center flex-wrap"
        >
          {formData.languages.map((language, index) => {
            let lang = language.language;
            let proficiency = language.proficiency;
            return (
              <div key={index}>
                <div class="flex justify-center cursor-pointer flex-wrap sm:max-w-[514px] sm:mx-auto">
                  <div class="flex items-center rounded-full bg-gradient text-white py-1 px-2 text-xs mb-2 mr-2">
                    <span class="mr-2">{lang}</span>
                    <MdOutlineCancel size={20}
                      onClick={() => handleLanguageRemove(index)}
                      />
                  </div>

                  <div class="flex rounded-full border border-1 border-orange-400 py-1 px-2 text-orange-400 text-xs mb-2 mr-2">
                    <span class="mr-2">Conversational</span>
                    <input
                      type="radio"
                      name={`proficiency-${index}`}
                      checked={proficiency == "Conversational"}
                      onChange={() =>
                        handleLanguageChange(
                          index,
                          "proficiency",
                          "Conversational"
                        )
                      }
                    />
                  </div>

                  <div class="flex rounded-full border border-1 border-orange-400 py-1 px-2 text-orange-400 text-xs mb-2 mr-2">
                    <span class="mr-2">Fluent</span>
                    <input
                      type="radio"
                      name={`proficiency-${index}`}
                      checked={proficiency == "Fluent"}
                      onChange={() =>
                        handleLanguageChange(index, "proficiency", "Fluent")
                      }
                    />
                  </div>

                  <div class="flex rounded-full border border-1 border-orange-400 py-1 px-2 text-orange-400 text-xs mb-2">
                    <span class="mr-2">Native</span>
                    <input
                      type="radio"
                      name={`proficiency-${index}`}
                      checked={proficiency == "Native"}
                      onChange={() =>
                        handleLanguageChange(index, "proficiency", "Native")
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SelectedLanguages;
