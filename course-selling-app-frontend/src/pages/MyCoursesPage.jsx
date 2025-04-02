// src/pages/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/mycourses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load my courses:", err);
        setError("Failed to load your purchased courses.");
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Purchased Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link to={`/mycourses/${course.courseId}`} key={course.courseId}>
            <div className="border p-4 rounded shadow hover:shadow-lg transition">
              <img
                src={`http://localhost:5025${course.thumbnailUrl.startsWith("/images") ? course.thumbnailUrl : `/images/${course.thumbnailUrl}`}`}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;
