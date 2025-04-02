// src/pages/MyCourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const MyCourseDetail = () => {
  const { id } = useParams(); // courseId from route
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course:", err);
        setError("Unable to load course details.");
      }
    };

    fetchCourse();
  }, [id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!course) return <div className="p-6">Loading course...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={`http://localhost:5025${course.thumbnailUrl.startsWith("/images") ? course.thumbnailUrl : `/images/${course.thumbnailUrl}`}`}
        alt={course.title}
        className="w-full h-64 object-cover rounded shadow mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-4">{course.description}</p>

      <div className="bg-gray-100 p-4 rounded">
        {/* Replace with actual video or downloadable content later */}
        <p>📚 Course Content Coming Soon!</p>
      </div>
    </div>
  );
};

export default MyCourseDetail;
