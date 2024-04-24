import React from "react";
import countries from "../utils/countries";
import { FaTrashAlt } from "react-icons/fa";

const RelocateAreas = ({ formData, setFormData }) => {
  const handleAddLocation = () => {
    const newLocations = [
      ...formData.preferred_locations,
      { country: "", city: "" },
    ];
    setFormData({ ...formData, preferred_locations: newLocations });
  };

  const handleRemoveLocation = (index) => {
    const currentLocations = formData.preferred_locations;
    const updatedLocations = [
      ...currentLocations.slice(0, index),
      ...currentLocations.slice(index + 1),
    ];
    setFormData({ ...formData, preferred_locations: updatedLocations });
  };

  const handleLocationChange = (index, key, value) => {
    const newLocations = [...formData.preferred_locations];
    newLocations[index][key] = value;
    setFormData({ ...formData, preferred_locations: newLocations });
  };

  return (
    <>
      <div class="col-span-6 text-sm">
        {/* <!-- Relocate areas section here --> */}
        <div class="flex justify-center gap-4 sm:justify-between sm:mt-4">
          <label class="font-semibold leading-6 text-gradient pl-[14px] sm:pl-0">
            Preferred Areas of Relocation
          </label>

          <button
            type="button"
            class="rounded-full bg-gradient text-white w-[150px] h-fit py-2 px-3"
            onClick={handleAddLocation}
          >
            Add More +
          </button>
        </div>

        {formData.preferred_locations.map((location, index) => {
          return (
            <div
              key={index}
              class="flex flex-row min-[375px]:flex-row justify-between items-center px-1 mt-4 "
            >
              <div class="w-[40%]">
                <div class="relative">
                  <input
                    type="text"
                    name="country"
                    autoComplete="country-name"
                    class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={location.country}
                    placeholder="Select Country"
                    onChange={(e) =>
                      handleLocationChange(index, "country", e.target.value)
                    }
                  />
                </div>
                <datalist id="countries">{countries}</datalist>
              </div>

              <div className="w-[40%]">
                <div class="mt-2 sm:mt-0 relative">
                  <input
                    type="text"
                    list="city"
                    name="city"
                    autoComplete="city-name"
                    class="w-full border border-[#afafaf] text-[#afafaf] text-sm rounded-full px-[15px] py-[10px]"
                    value={location.city}
                    placeholder="Select City"
                    onChange={(e) =>
                      handleLocationChange(index, "city", e.target.value)
                    }
                  />
                </div>
              </div>

              <FaTrashAlt
                  color="#afafaf"
                  size={20}
                  className="w-[10%]"
                  onClick={() => handleRemoveLocation(index)}
                />

            </div>
          );
        })}
      </div>
    </>
  );
};
export default RelocateAreas;
