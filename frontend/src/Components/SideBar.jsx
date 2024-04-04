import React from "react";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";
import { MdEditDocument } from "react-icons/md";
import Logout from "./Logout";
import { useAuthContext } from "../Context/Context";

const SideBar = () => {
  const {authUser} = useAuthContext();

  return (
    <aside
      className="flex flex-col items-center min-w-20 sm:w-18 sticky top-0 left-0 h-screen py-8 overflow-y-auto bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 
		bg-gray-700/30 text-white"
    >
      <nav className="h-full flex flex-col gap-3">
        <Link
          to="/"
          className="p-1.5 flex justify-center hover:bg-gray-900 rounded-md"
        >
          <img className="h-8" src="/github.svg" alt="GitHub logo"></img>
        </Link>

        <Link
          to="/"
          className="p-1.5 flex justify-center transition-colors duration-200 rounded-md hover:bg-gray-900"
        >
          <IoHomeSharp size={25} />
        </Link>

        {authUser && (
          <Link
            to="/likes"
            className="p-1.5 flex justify-center transition-colors duration-200 rounded-md hover:bg-gray-900"
          >
            <FaHeart size={22} />
          </Link>
        )}

        {authUser && (
          <Link
            to="/explore"
            className="p-1.5  flex justify-center transition-colors duration-200 rounded-md hover:bg-gray-900"
          >
            <MdOutlineExplore size={25} />
          </Link>
        )}

        {!authUser && (
          <Link
            to="/login"
            className="p-1.5 focus:outline-nones transition-colors duration-200 rounded-md hover:bg-gray-900"
          >
            <PiSignInBold size={25} />
          </Link>
        )}

        {!authUser && (
          <Link
            to="/signup"
            className="p-1.5 focus:outline-nones transition-colors duration-200 rounded-md hover:bg-gray-900"
          >
            <MdEditDocument size={25} />
          </Link>
        )}

        {authUser && (
          <div className="flex flex-col gap-2 mt-auto">
            <Logout />
          </div>
        )}
      </nav>
    </aside>
  );
};

export default SideBar;
