import React, { Fragment, useContext } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, Transition } from "@headlessui/react";
import { AuthContext } from '../../Context/AuthProvider';
import Logo from './Logo';

const Navbar = () => {

    const { user, removeUser } = useContext(AuthContext);

    const handleLogout = () => removeUser();

    const commonLinks = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `text-lg font-semibold ${isActive ? "text-[#576BFE]" : "text-gray-600"}`
                    }
                >
                    Home
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/all-issues"
                    className={({ isActive }) =>
                        `text-lg font-semibold ${isActive ? "text-[#576BFE]" : "text-gray-600"}`
                    }
                >
                    All Issues
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `text-lg font-semibold ${isActive ? "text-[#576BFE]" : "text-gray-600"}`
                    }
                >
                    About
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        `text-lg font-semibold ${isActive ? "text-[#576BFE]" : "text-gray-600"}`
                    }
                >
                    Contact Us
                </NavLink>
            </li>
        </>
    );

    const privateLinks = (
        <>
            <Menu.Item>
                {({ active }) => (
                    <Link to="/dashboard" className={`${active ? "bg-gray-700/40" : ""} group flex rounded-md w-full px-4 py-2 text-base text-gray-300`}>
                        Dashboard
                    </Link>
                )}
            </Menu.Item>

            <Menu.Item>
                {({ active }) => (
                    <button onClick={handleLogout} className={`${active ? "bg-gray-700/40" : ""} group flex rounded-md w-full px-4 py-2 text-sm text-red-400`}>
                        Logout
                    </button>
                )}
            </Menu.Item>
        </>
    );

console.log(user)
    return (
        <div className='sticky top-0 z-40 shadow-sm bg-base-200'>
            <div className="navbar max-w-7xl mx-auto max-h-18 px-6">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {commonLinks}


                        </ul>
                    </div>
                    <Logo></Logo>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {commonLinks}


                    </ul>
                </div>

                <div className="navbar-end">
                    {!user ? (
                        <Link to="/login" className="btn bg-gradient text-xl text-white font-extrabold rounded-lg px-9 py-6 lg:flex">Log In</Link>
                    ) : (
                        <Menu as="div" className="relative">
                            <Menu.Button className="rounded-full w-12 h-12 overflow-hidden border border-primary cursor-pointer">
                                <img
                                    src={user?.photoURL || "/default-user.png"}
                                    alt={user?.displayName || "User"}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-semibold text-primary">
                                            <span className="text-base text-gray-300">Hello,</span> {user?.displayName}
                                        </p>
                                    </div>
                                    <div className="px-1 py-2">{privateLinks}</div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Navbar;