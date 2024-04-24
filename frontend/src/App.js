import React from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import SignUp from "./pages/signup";
import EditProfile from "./pages/editProfile";
import Otp from "./pages/otp";

import FlashMessage from "./components/flashMessage";
import ChangePassword from "./pages/changePassword";
import ForgotPassword from "./pages/forgotPassword";

//import Meeting_List from "./components/Call_And_Conference/Meeting_list";
//import Meeting_Des from "./components/Call_And_Conference/Meeting_des";
//
//import Call_Booking from './components/Call_And_Conference/call_booking';
//import Conference from "./components/Call_And_Conference/conference";
//
//import Price from "./components/Call_And_Conference/Price";
//import Calendar from "./components/Call_And_Conference/month_cal";

import Cabinet from "./pages/cabinet";
//import Search from "./pages/search";

import Cookies from "js-cookie";
import "./App.css";
import { LinkedInCallback } from "react-linkedin-login-oauth2";


function App() {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const isAuthenticated = Cookies.get("authToken") !== undefined;

  const PrivateRoute = ({ element, ...rest }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <FlashMessage
        message={message}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
      />

      <Routes>
        <Route exact path="/linkedin" element={<LinkedInCallback />} />

        <Route
          path="/"
          element={
            <Login
              setMessage={setMessage}
              setShowMessage={setShowMessage}
              setProfilePic={setProfilePic}
            />
          }
        />

        <Route
          path="verify"
          element={
            isAuthenticated ? (
              <Otp setMessage={setMessage} setShowMessage={setShowMessage} />
            ) : (
              <Login
                setMessage={setMessage}
                setShowMessage={setShowMessage}
                setProfilePic={setProfilePic}
              />
            )
          }
        />

        <Route
          path="signup"
          element={
            <SignUp
              setMessage={setMessage}
              setShowMessage={setShowMessage}
              setProfilePic={setProfilePic}
            />
          }
        />

        <Route
          path="change-password"
          element={
            isAuthenticated ? (
              <ChangePassword
                setMessage={setMessage}
                setShowMessage={setShowMessage}
              />
            ) : (
              <Login
                setMessage={setMessage}
                setShowMessage={setShowMessage}
                setProfilePic={setProfilePic}
              />
            )
          }
        />

        {/* <Route
          path="forgot-password"
          element={
            <ForgotPassword setMessage={setMessage} setShowMessage={setShowMessage} />
          }
        /> */}

        <Route
          path="edit-profile"
          element={
            isAuthenticated ? (
              <EditProfile
                setMessage={setMessage}
                setShowMessage={setShowMessage}
                profilePic={profilePic}
              />
            ) : (
              <Login
                setMessage={setMessage}
                setShowMessage={setShowMessage}
                setProfilePic={setProfilePic}
              />
            )
          }
        />

        <Route
          path="cabinet"
          element={
            isAuthenticated ? (
              <Cabinet profilePic={profilePic} />
            ) : (
              <Login
                setMessage={setMessage}
                setShowMessage={setShowMessage}
                setProfilePic={setProfilePic}
              />
            )
          }
        />

        
        
        
      </Routes>
    </Router>
  );
}

export default App;
