import React from 'react'
import Cookies from "js-cookie";
import MenuBottomTeacher from './menuBottom_teacher';
import MenuBottom from './menuBottomStudent';
const MainMenu = () => {
    
  const user_type = Cookies.get('user_type')
  console.log(user_type)
  return (
    <div className='flex justify-center'>
      {user_type === 'Student' ? (
        <MenuBottom/>
      ) : user_type === 'Teacher' ? (
        <MenuBottomTeacher/>
      ) : null}
    </div>
  );
}

export default MainMenu