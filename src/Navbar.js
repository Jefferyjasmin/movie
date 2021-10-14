import React from "react";
import { useEffect, useState } from "react";
import "./Nav.css";

const Navbar = () => {
  const [show, handleShow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll");
    };
  }, []);

  return (
    <div className={`nav ${show && "nav_black"}`}>
      <img
        className="nav_logo"
        src="https://w7.pngwing.com/pngs/713/1015/png-transparent-graphic-film-video-cameras-computer-icons-video-icon-photography-film-black-and-white.png"
        alt="Movie Icon"
      />

      <img
        className="nav_avatar"
        alt="User icon"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/768px-User_icon_2.svg.png"
      />
    </div>
  );
};

export default Navbar;
