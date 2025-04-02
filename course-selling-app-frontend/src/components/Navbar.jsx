import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useBasket } from "../context/BasketContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { basket } = useBasket();
    const navigate = useNavigate();

    console.log("Current user:", user);


    const handleLogout = () => {
        logout(); // your AuthContext's logout should already navigate if needed
    };

    return (
        <nav className="bg-white shadow px-6 py-3 sticky top-0 z-50 flex justify-between items-center">
            {/* Left Side - Logo & Links */}
            <div className="flex items-center space-x-6">
                <Link to="/home" className="text-2xl font-bold text-purple-700">
                    CourseApp
                </Link>

                {user && (
                    <div className="flex items-center space-x-4">
                        <Link to="/courses" className="text-gray-700 hover:text-purple-700">
                            Courses
                        </Link>
                        <Link to="/my-courses" className="hover:underline">My Courses</Link>
                        {user.role === "Admin" && (
                            <Link to="/admin" className="text-gray-700 hover:text-purple-700">
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <Link to="/courses" className="text-gray-700 hover:text-purple-600">Courses</Link>
                <Link to="/basket" className="hover:text-blue-400 mr-4">Basket</Link>

            </div>

            {/* Right Side - Role & Logout */}
            <div className="flex items-center space-x-4">
                {user && (
                    <>
                        <span className="text-sm text-gray-600 capitalize">
                            {user.role} 🧑
                        </span>
                        <button
                            onClick={logout}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
