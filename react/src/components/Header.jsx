import React, { useEffect, useState } from "react";
import logo from "../../../logo/logo.svg";
import { supabase } from "../supabase.js";
import SignOutUser, { signOutUser } from "../utils/SignOutUser.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchFirstName } from "../utils/CacheWorkings.jsx";
import NotificationPanel from "./components/NotificationPanel.jsx";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // artifacts of a dream
  const [signedIn, setSignedIn] = useState(false);
  // const [notificationsOpen, setNotificationsOpen] = useState(false);
  let standardColor = "hover:text-red-600 focus:text-red-600";

  const location = useLocation();

  // Check if the current path is whatever the current path is.
  const isDashboard = location.pathname === "/dashboard";
  const isCourses = location.pathname === "/courses";

  useEffect(() => {
    const getFirstName = async () => {
      const name = await fetchFirstName();
      setFirstName(name);
    };
    getFirstName();
  }, []);

  return (
    <header className={`pb-6 bg-white lg:pb-0`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <a href="#" title="" className="flex">
              <Link to="/dashboard">
                <img className="w-auto h-8 lg:h-10" src={logo} alt="" />
              </Link>
            </a>
          </div>

          {/*Also used for mobile version. if i ever get around to doing it*/}
          {/*<button*/}
          {/*    type="button"*/}
          {/*    className={`inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden hover:bg-gray-100 ${*/}
          {/*        menuOpen ? "bg-gray-100" : ""*/}
          {/*    }`}*/}
          {/*    onClick={() => setMenuOpen(!menuOpen)}*/}
          {/*>*/}
          {/*    /!* Hamburger Icon *!/*/}
          {/*    <svg*/}
          {/*        className={`${menuOpen ? "hidden" : "block"} w-6 h-6`}*/}
          {/*        xmlns="http://www.w3.org/2000/svg"*/}
          {/*        fill="none"*/}
          {/*        viewBox="0 0 24 24"*/}
          {/*        stroke="currentColor"*/}
          {/*    >*/}
          {/*        <path*/}
          {/*            strokeLinecap="round"*/}
          {/*            strokeLinejoin="round"*/}
          {/*            strokeWidth="2"*/}
          {/*            d="M4 8h16M4 16h16"*/}
          {/*        />*/}
          {/*    </svg>*/}

          {/*    /!* Close Icon *!/*/}
          {/*    <svg*/}
          {/*        className={`${menuOpen ? "block" : "hidden"} w-6 h-6`}*/}
          {/*        xmlns="http://www.w3.org/2000/svg"*/}
          {/*        fill="none"*/}
          {/*        viewBox="0 0 24 24"*/}
          {/*        stroke="currentColor"*/}
          {/*    >*/}
          {/*        <path*/}
          {/*            strokeLinecap="round"*/}
          {/*            strokeLinejoin="round"*/}
          {/*            strokeWidth="2"*/}
          {/*            d="M6 18L18 6M6 6l12 12"*/}
          {/*        />*/}
          {/*    </svg>*/}
          {/*</button>*/}

          {/*for when there is a transition <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">*/}

          <div className="flex items-center ml-auto space-x-10">
            <button
              className={`text-base font-medium transition-all duration-200 ${standardColor} ${isDashboard ? "text-red-600" : ""}`}
              disabled={isDashboard}
              onClick={(event) => navigate("/dashboard")}
            >
              {" "}
              Dashboard
            </button>
            <button
              className={`text-base font-medium transition-all duration-200 ${standardColor} ${isCourses ? "text-red-600" : ""}`}
              disabled={isCourses}
              onClick={(event) => navigate("/courses")}
            >
              {" "}
              Courses
            </button>
            <NotificationPanel></NotificationPanel>
          </div>

          <div
            className={`border border-amber-600 rounded ml-7 p-1 bg-gray-200 content-center justify-center flex-col`}
          >
            <div className="flex items-center justify-between ml-2">
              <p className="text-gray-600 leading-tight text-center">
                Welcome back, {firstName}!
              </p>
              <div className={`mt-1 flex`}>
                <IconButton
                    sx={{ fontSize: "30px"}}>
                  <PersonIcon
                  sx={{fontSize: "inherit"}}/>
              </IconButton>
                <IconButton
                  aria-label="Logout"
                  sx={{ color: "red"}}
                  onClick={async (e) => {
                    await signOutUser(e);
                    navigate("/login");
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            </div>
            {/*<button*/}
            {/*  className={`underline text-red-500 content-center text-center`}*/}
            {/*  onClick={async (e) => {*/}
            {/*    await signOutUser(e);*/}
            {/*    navigate("/login");*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Not you?*/}
            {/*</button>*/}
          </div>
          {/*<button onClick={(event) => setNotificationsOpen(!notificationsOpen)}>*/}
          {/*  Notifications*/}
          {/*</button>*/}
          {/*<div className="bg-gray-300 rounded ml-3 border border-red-500">*/}
          {/*<NotificationPanel></NotificationPanel></div>*/}
        </nav>

        {/* being blunt, this is not the best way to do a pc-mobile transition. nor was i planning on doing this but regardless. i will complete this when we finish all the pages. This isnt executed the most properly.
                  and perhaps its a little overzealous*/}
        {/*<nav*/}
        {/*    className={`pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md transition-all duration-300 transform ${*/}
        {/*        menuOpen*/}
        {/*            ? "opacity-100 scale-100" // Fully visible*/}
        {/*            : "opacity-0 scale-95 pointer-events-none" // Hidden with animation*/}
        {/*    } lg:hidden`}*/}
        {/*   >*/}
        {/*    <div className="flow-root">*/}
        {/*        <div className="flex flex-col px-6 -my-2 space-y-1">*/}
        {/*            <a href="#" title=""*/}
        {/*               className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Features </a>*/}

        {/*            <a href="#" title=""*/}
        {/*               className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Solutions </a>*/}

        {/*            <a href="#" title=""*/}
        {/*               className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Resources </a>*/}

        {/*            <a href="#" title=""*/}
        {/*               className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Pricing </a>*/}
        {/*        </div>*/}
        {/*    </div>*/}

        {/*    <div className="px-6 mt-6">*/}
        {/*        <a href="#" title=""*/}
        {/*           className="inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md tems-center hover:bg-blue-700 focus:bg-blue-700"*/}
        {/*           role="button"> Get started now </a>*/}
        {/*    </div>*/}
        {/*</nav>*/}
      </div>
      <footer className="bg-red-600 p-2 shadow-md"></footer>
    </header>
  );
};

export default Header;
