import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/photo_2024-07-20_00-20-04.png";


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 fixed top-0 left-0 right-0 max-w-full z-[0] shadow-lg" dir="rtl">
      <div className="container mx-auto flex justify-between items-center gap-0 md:gap-52">
        <a href="/" className="text-teal-400 font-bold text-2xl flex items-center">
        <img alt="logo" src={logo} className="w-14 h-11 rounded-full mr-2"/>        </a>
        <div className="flex gap-4">
          <div className="md:hidden" onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="text-teal-400 cursor-pointer" size={24} />
            ) : (
              <FaBars className="text-teal-400 cursor-pointer" size={24} />
            )}
          </div>
        </div>
        <div
          className={`fixed gap-2 top-0 right-0 w-full h-[70vh] md:h-full bg-gradient-to-r from-blue-900 to-blue-700 p-4 transform ${
            isOpen
              ? "translate-y-0"
              : "-translate-y-full"
          } transition-transform duration-500 ease-in-out md:relative md:translate-y-0 md:flex md:items-center md:bg-transparent md:p-0`}
        >
          <div className="flex justify-end md:hidden">
            <div onClick={toggleMenu}>
              <FaTimes className="text-teal-400 cursor-pointer" size={24} />
            </div>
          </div>
          <ul className="flex flex-col items-center justify-center text-[#00e8c1] h-auto space-y-6 text-center md:flex-row md:space-x-6 md:space-y-0 md:text-right mt-7 md:mt-0 animate__animated animate__fadeInDown">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-lg px-10 py-3 text-sm font-medium text-white underline"
                    : "block rounded-lg px-10 py-3 text-sm font-medium text-[#00e8c1] hover:text-white"
                }
                onClick={handleLinkClick}
              >
                اللاعبون
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/trainers"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-lg px-10 py-3 text-sm font-medium text-white underline"
                    : "block rounded-lg px-10 py-3 text-sm font-medium text-[#00e8c1] hover:text-white"
                }
                onClick={handleLinkClick}
              >
                المدربين
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-lg px-10 py-3 text-sm font-medium text-white underline"
                    : "block rounded-lg px-10 py-3 text-sm font-medium text-[#00e8c1] hover:text-white"
                }
                onClick={handleLinkClick}
              >
                الحضور والانصرف
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-lg px-10 py-3 text-sm font-medium text-white underline"
                    : "block rounded-lg px-10 py-3 text-sm font-medium text-[#00e8c1] hover:text-white"
                }
                onClick={handleLinkClick}
              >
                تسجيل الدخول
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
