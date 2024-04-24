import React from 'react'
import Cookies from "js-cookie"
import StudentProfile from './student/studentProfile';
import TeacherProfile from './teacher/teacherProfile';
import MainMenu from "../components/MenuBottom/MainMenu"


const EditProfile = ({setShowMessage,setMessage,profilePic}) => {

  const user_type=Cookies.get("user_type")
  console.log(user_type)

  return (
    <>
    {
        user_type == "Student" ? (
            <StudentProfile setShowMessage={setShowMessage} setMessage={setMessage} profilePic={profilePic}/>
        ) : (
            <TeacherProfile setShowMessage={setShowMessage} setMessage={setMessage} profilePic={profilePic}/>
        )
    }
    {/* menu component */}
    <div className='pt-9'>
          <MainMenu/>
    </div>
  </>
  )
}

export default EditProfile;