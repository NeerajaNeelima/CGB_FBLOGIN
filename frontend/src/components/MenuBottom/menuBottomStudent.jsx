import React, { useState } from 'react';
import '../../App.css'
import { FaCalendarCheck, FaComments } from 'react-icons/fa';
import { IoPersonCircle,IoNotifications } from 'react-icons/io5';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { RiLogoutBoxRLine,RiSearch2Fill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const MenuBottom = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State variables for tracking active status of each menu item
    const [isActiveCalendar, setIsActiveCalendar] = useState(false);
    const [isActiveComments, setIsActiveComments] = useState(false);
    //const [isActiveProfile, setIsActiveProfile] = useState(false);
    //const [isActiveForum, setIsActiveForum] = useState(false);
    const[isActiveDots,setActiveDot]=useState(false);
    const[isOpen,setIsOpen]=useState(false);
    const[isActiveSearch,setActiveSearch]=useState(false);

    const [isHoveredProfile, setIsHoveredProfile] = useState(false);
    const [isHoveredEvents, setIsHoveredEvents] = useState(false);
    const [isHoveredForum, setIsHoveredForum] = useState(false);
    const [isHoverLogout,setHoverLogout]=useState(false)

  const handleMouseEnterProfile = () => {
    setIsHoveredProfile(true);
  };

  const handleMouseLeaveProfile = () => {
    setIsHoveredProfile(false);
  };
  const handleMouseEnterEvents = () => {
    setIsHoveredEvents(true);
  };

  const handleMouseLeaveEvents = () => {
    setIsHoveredEvents(false);
  };
  const handleMouseEnterForum = () => {
    setIsHoveredForum(true);
  };

  const handleMouseLeaveForum = () => {
    setIsHoveredForum(false);
  };
  const handleMouseEnterLogout = () => {
    setHoverLogout(true);
  };

  const handleMouseLeaveLogout = () => {
    setHoverLogout(false);
  };


    const handleCalendarClick = () => {
        if (isLoggedIn()) {
            navigate('/calender_page');
            setIsActiveCalendar(true);
            setIsActiveComments(false);
            //setIsActiveProfile(false);
            //setIsActiveForum(false);
        }
    };

    const handleCommentsClick = () => {
        if (isLoggedIn()) {
            navigate('/chat');
            setIsActiveCalendar(false);
            setIsActiveComments(true);
            //setIsActiveProfile(false);
            //setIsActiveForum(false);
        }
    };

    const handlePersonCircleClick = () => {
        if (isLoggedIn()) {
            navigate('/cabinet');
            setIsActiveCalendar(false);
            setIsActiveComments(false);
            //setIsActiveProfile(true);
            //setIsActiveForum(false);
        }
    };

    const handleUserGroupClick = () => {
        if (isLoggedIn()) {
            navigate('/forum');
            setIsActiveCalendar(false);
            setIsActiveComments(false);
            //setIsActiveProfile(false);
            //setIsActiveForum(true);
            setActiveDot(false)
            setActiveSearch(false)
        }
    };

    const handleSearchClick = () =>{
        if (isLoggedIn()) {
            navigate('/search');
            setIsActiveCalendar(false);
            setIsActiveComments(false);
            //setIsActiveProfile(false);
            //setIsActiveForum(false);
            setActiveDot(false)
            setActiveSearch(true)
        }
    }
    const handleDotClick = () =>{
        if (isLoggedIn()) {
            
            setIsActiveCalendar(false);
            setIsActiveComments(false);
            setActiveSearch(false);
            setActiveDot(true);
            setIsOpen(!isOpen);

        }
    }

    const hadleNotification = () =>{

    }

    const isLoggedIn = () => {
        // Check if the user is logged in
        return Cookies.get('authToken') !== null;
    };

    return (
        <div
            className="flex flex-row justify-between shadow-md items-center px-[32px] rounded-[100px] w-10/12 h-[64px] mb-3 "
            style={{
                background: 'linear-gradient(180deg, #ff6535 0%, #ff9e48 48.9%, #ffce58 100%)',
                position: 'fixed',
                bottom: 0,
            }}
        >
            <RiSearch2Fill 
            className={`text-3xl ${isActiveSearch ? 'text-white' : 'text-[#F3C699]'} cursor-pointer hover:text-white`}
            onClick={handleSearchClick}
            />
            
            <FaCalendarCheck
                className={`text-3xl ${isActiveCalendar ? 'text-white' : 'text-[#F3C699]'} cursor-pointer hover:text-white`}
                onClick={handleCalendarClick}
            />
            <FaComments
                className={`text-4xl ${isActiveComments ? 'text-white' : 'text-[#F3C699]'} cursor-pointer hover:text-white`}
                onClick={handleCommentsClick}
            />
            <BsThreeDotsVertical 
                className={`text-4xl ${isActiveDots ? 'text-white' : 'text-[#F3C699]'} cursor-pointer hover:text-white`}
                onClick={handleDotClick}
            />
            {isOpen ? (
                <div className="absolute bottom-14 right-0 w-34 bg-white p-4 rounded-lg mt-2 mb-4 flex flex-col gap-3">
                    <div className='button w-56 h-10 flex justify-evenly cursor-pointer' onClick={handleUserGroupClick}
                    onMouseEnter={handleMouseEnterForum}
                    onMouseLeave={handleMouseLeaveForum}
                    >
                        <HiMiniUserGroup
                            style={{color: isHoveredForum ? 'white' : 'orange',fontSize:'2rem'}}
                        />
                        <span className=' text-lg'>Forum</span>
                    </div>
                    <div className='button w-56 h-10 flex justify-evenly cursor-pointer'onClick={handlePersonCircleClick}
                    onMouseEnter={handleMouseEnterProfile}
                    onMouseLeave={handleMouseLeaveProfile}>
                        <IoPersonCircle style={{color: isHoveredProfile ? 'white' : 'orange',fontSize:'2rem'}} />
                        <span className=' text-lg'>Profile</span>
                    </div>
                    <div className='button w-56 h-10 flex justify-evenly cursor-pointer'onClick={hadleNotification }
                    onMouseEnter={handleMouseEnterEvents}
                    onMouseLeave={handleMouseLeaveEvents}
                    >
                        <IoNotifications
                            style={{color: isHoveredEvents ? 'white' : 'orange',fontSize:'2rem'}}
                        />
                        <span className=' text-lg'>Notification</span>
                    </div>
                    <div className='button w-56 h-10 flex justify-evenly cursor-pointer' onClick={isLoggedIn}
                    onMouseEnter={handleMouseEnterLogout}
                    onMouseLeave={handleMouseLeaveLogout}
                    >
                        <RiLogoutBoxRLine
                            style={{color: isHoverLogout ? 'white' : 'orange',fontSize:'2rem'}}
                        />
                        <span className=' text-lg'>Logout</span>
                    </div>
                    
            
                </div>
                ) : (null)
            }
            {/*<HiMiniUserGroup
                className={`text-4xl ${isActiveForum ? 'text-white' : 'text-[#F3C699]'} cursor-pointer`}
                onClick={handleUserGroupClick}
            />
            <IoPersonCircle
                className={`text-4xl ${isActiveProfile ? 'text-white' : 'text-[#F3C699]'} cursor-pointer`}
                onClick={handlePersonCircleClick}
        />*/}
        </div>
    );
};

export default MenuBottom;
