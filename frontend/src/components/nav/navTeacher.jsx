import { FaCalendarCheck, FaComments, FaUserCircle } from "react-icons/fa";
import { IoPersonCircle, IoNotifications } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { RiLogoutBoxRLine, RiSearch2Fill } from "react-icons/ri";
import { TbCalendarTime } from "react-icons/tb";

import logo from "../../assets/img/logo.png";


function NavTeacher(){
return (
<nav className="hidden sm:flex items-center justify-center h-[96px] w-full bg-gradient px-5 lg:px-[72px]">
          <div className="w-full max-w-[1300px] mx-auto sm:flex flex-wrap md:gap-10 items-center justify-center lg:justify-between">
            <div className="hidden lg:block">
              <img className="w-[308px]" src={logo} alt="logo" />
            </div>
            <div className="flex items-center justify-center gap-8">
              <RiSearch2Fill className="cursor-pointer" size={40} color="white"/>
              <TbCalendarTime className="cursor-pointer" size={40} color="white"/>
              <FaComments className="cursor-pointer" size={40} color="white"/>
              <HiMiniUserGroup className="cursor-pointer" size={40} color="white"/>
              <IoPersonCircle className="cursor-pointer" size={40} color="white"/>
              <IoNotifications className="cursor-pointer" size={40} color="white"/>
              <RiLogoutBoxRLine className="cursor-pointer" size={40} color="white"/>
            </div>
          </div>
        </nav>
)
}

export default NavTeacher;