import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    console.log("Current user:", user);


    const handleLogout = () => {
        logout(); // your AuthContext's logout should already navigate if needed
    };

    return (
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
            <Link to="/home" className="text-xl font-bold text-blue-800">
                CourseApp
            </Link>
            <div className="space-x-4">
                <Link to="/courses" className="text-blue-600 hover:text-blue-800">
                    Courses
                </Link>

                {user?.role === "Admin" && (
                    <Link to="/admin" className="text-red-600 hover:text-red-800">
                        Admin Dashboard
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
