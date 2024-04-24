import React, { useState } from "react";
import bg from '../assets/img/background-2.png';
import logo from '../assets/img/logo.png';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {FaRegEyeSlash,FaLock} from "react-icons/fa"

const ForgotPassword = () => {

    const initialData={
        new_password:'',
        confirm_password:''
    }
    const [userData,setData] = useState(initialData);
    const [showPwd,setShowPwd] = useState(false)
    const [showConfirmPwd,setShowConfirmPwd] = useState(false)

    const handleFormSubmit=()=>{

    }

  return (
    <div>
    <div
      className="bg-contain bg-no-repeat w-full h-[280px] sm:mx-auto sm:w-full sm:max-w-md max-[415px]:bg-cover"
      style={{backgroundImage: `url("${bg}")`}}
    >
      <div className="pl-9 pt-16 max-w-[433px]">
        <img src={logo} alt="logo" />
        <div className="pt-8 text-white">
          <h1 className="text-2xl font-medium">Forgot Password</h1>
        </div>
      </div>
    </div>

    <div className="sm:mx-auto sm:w-full sm:max-w-[480px] mt-[-30px]">
      <div className="px-[29px]">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-semibold text-[#585858] pl-4"
              >New Password
              </label>
            <div className="relative mt-1">
              <input
                id="new_password"
                name="new_password"
                type={showPwd === false ? "password":"text" }
                value={userData.new_password}
                onChange={(e)=>setData({...userData,new_password:e.target.value})}
                required
                className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
              />
               <div
                className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none"
              >
                <FaLock color="#808080"/>
              </div>
              <div
                className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer"
              >
                {
                  showPwd === false ? (
                    <FaRegEyeSlash color="#808080" onClick={()=>setShowPwd(true)}/>
                  ) : (
                    <MdOutlineRemoveRedEye color="#808080" onClick={()=>setShowPwd(false)}/>
                  )
                }
                
              </div>
            </div>

          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-semibold text-[#585858] pl-4"
              >Confirm New password
              </label>
            <div className="relative mt-1">
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPwd === false ? "password":"text"}
                value={userData.confirm_password}
                onChange={(e)=>setData({...userData,confirm_password:e.target.value})}
                required
                className="pl-10 pr-4 py-3 border border-[#585858] text-sm w-full rounded-full"
              />
               <div
                className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none"
              >
              <FaLock color="#808080"/>

              </div>

              <div
                className="absolute inset-y-0 right-0 pr-[10px] flex items-center cursor-pointer"
              >
                {
                  showConfirmPwd === false ? (
                    <FaRegEyeSlash color="#808080" onClick={()=>setShowConfirmPwd(true)}/>
                  ) : (
                    <MdOutlineRemoveRedEye color="#808080" onClick={()=>setShowConfirmPwd(false)}/>
                  )
                }
              </div>

            </div>

          </div>

          <div className='flex justify-center'>
            <button type="button" className="flex w-[273px] justify-center rounded-full text-white p-[10px] bg-gradient" 
            onClick={handleFormSubmit}
            >
            Change Password
            </button>
          </div>
        </form>

      </div>

    </div>
  </div>
  );
};

export default ForgotPassword;
