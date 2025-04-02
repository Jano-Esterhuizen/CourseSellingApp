// src/pages/HomePage.jsx
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome {user?.role === "Admin" ? "Admin" : "User"}!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          You are logged in as <span className="font-semibold">{user?.role}</span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/courses"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md text-lg"
          >
            Browse Courses
          </Link>

          <Link
            to="/my-courses"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md text-lg"
          >
            My Courses
          </Link>

          {user?.role === "Admin" && (
            <Link
              to="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-md text-lg"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
