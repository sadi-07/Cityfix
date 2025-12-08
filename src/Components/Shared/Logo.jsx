import React from 'react';
import { Link } from "react-router";
import logo from "../../assets/logo.png";

const Logo = () => {
    return (
        <div className="flex items-center">
            <Link to="/">
                <img
                    src={logo}
                    alt="CityFix Logo"
                    className="h-12 object-contain"
                    style={{ width: "auto" }}
                />
            </Link>
        </div>
    );
};

export default Logo;



