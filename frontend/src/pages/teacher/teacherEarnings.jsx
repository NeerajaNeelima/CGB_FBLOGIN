import React, { useState } from 'react';
import Header from '../../components/headerBackground';
import Calls from '../../components/teacher/callEarnings';
import Conference from '../../components/teacher/conferenceEarnings';
import Referrals from '../../components/teacher/referralEarnings';
import MenuBottom from '../../components/menuBottom';

const TeacherEarnings = () => {
  const components = ['calls', 'conference', 'referrals']; // Array of component names
  const [activeIndex, setActiveIndex] = useState(0); // State to track active component index

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % components.length); // Cycle through components
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length); // Cycle through components in reverse
  };

  return (
    <div className='flex flex-col gap-2 font-primary items-center min-h-screen'>
      <Header />
      <div className='fixed mt-[160px] self-start mx-8'>
        <p className='text-left text-[22px] text-[#585858] font-semibold'>Earnings</p>
      </div>
      {components[activeIndex] === 'calls' && (
        <Calls handleNext={handleNext} handlePrev={handlePrev} />
      )}
      {components[activeIndex] === 'conference' && (
        <Conference handleNext={handleNext} handlePrev={handlePrev} />
      )}
      {components[activeIndex] === 'referrals' && (
        <Referrals handleNext={handleNext} handlePrev={handlePrev} />
      )}
      <MenuBottom />
    </div>
  );
};

export default TeacherEarnings;
