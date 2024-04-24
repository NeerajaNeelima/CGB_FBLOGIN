import React from "react";
import shareBtn from "../assets/img/sharee.png";
import crossBtn from "../assets/img/x.png";
import { MdEmojiEmotions } from "react-icons/md";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ profileData,setProfileData }) => {
  console.log(profileData.id)
  const profile_type=Cookies.get("user_type")==="Teacher"?"Student":"Teacher"
  const navigate = useNavigate();
  const handleBook = (id) =>{
    console.log(id)
    navigate(`/book_list/${id}`)
  }
  const handleConference = (id) =>{
    navigate(`/teacher_conferences/${id}`)
  }

  return (
    <div style={{ display: profileData.display }} className="absolute top-[10%] left-[20%] opacity-100">
      <div className="flex items-center justify-center mt-[100px]">
        <div className="relative transform overflow-hidden rounded-3xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl  sm:my-8 sm:w-full sm:max-w-lg sm:p-6 z-50">
          <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
            <button type="button">
              <img src={crossBtn} alt="" onClick={()=>setProfileData({...profileData,display:"none"})}/>
            </button>
          </div>
          <div>
            <img src={profileData.profilePic} height={114} width={114} alt="" className="flex justify-center mx-auto" />
            <h1 className="text-center font-semibold text-2xl text-[#585858]">
              {profile_type}'s name
            </h1>
            <p className="text-center  font-normal text-[11px] text-[#585858] max-w-[257px] mx-auto pb-5">
            {profileData.about}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="bg-gradient text-white px-4 py-2 border-2 rounded-full w-48" onClick={()=>handleBook(profileData.id)}>
                Book a Call
              </button>
              <button className="text-gradient p-2 border-2 rounded-full flex items-center w-16">
                <span className="mr-2">5</span>
                <MdEmojiEmotions size={20} color="orange" />
              </button>
            </div>
            <div>
            <button className="bg-gradient text-white px-4 py-2 border-2 rounded-full mr-2 w-72" onClick={()=>handleConference(profileData.id)}>
                Book a Conference
              </button>
            </div>
            <div className="flex items-center justify-center mt-2">
              <button className="mr-2 text-gradient border-2 border-orange-400 rounded-full px-3 py-2">
                View Profile
              </button>
              <button className="ml-1 border-2 rounded-full flex p-2 w-32 justify-center">
                <span className="mr-2 text-gradient">Share</span>
                <img src={shareBtn} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
