// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { Link } from "react-router-dom";
import { useBasket } from "../context/BasketContext";



export default function CoursesPage() {
    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const { addToBasket } = useBasket();


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setCourses(response.data);
            } catch (err) {
                setError('Failed to load courses.');
                console.error(err);
            }
        };

        fetchCourses();
    }, [token]);

    const fetchCourses = async () => {
        try {
            const response = await api.get("/courses");
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setError("You must be logged in to view courses.");
            } else {
                setError("Failed to load courses.");
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="border rounded p-4 shadow hover:shadow-md transition">
                        <img
                            src={`http://localhost:5025${course.thumbnailUrl.startsWith('/images') ? course.thumbnailUrl : `/images/${course.thumbnailUrl}`}`}
                            alt={course.title}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <h2 className="text-xl font-semibold">{course.title}</h2>
                        <p>{course.description}</p>
                        <p className="text-sm text-gray-600">By {course.instructor}</p>
                        <p className="text-lg font-bold mt-2">${course.price}</p>
                        <div className="mt-4 flex justify-between">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                <Link to={`/courses/${course.id}`} className="text-blue-500 hover:underline">
                                    View Course
                                </Link>
                            </button>
                            <button
                                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                                onClick={() => addToBasket(course)}
                            >
                                Add to Basket
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
