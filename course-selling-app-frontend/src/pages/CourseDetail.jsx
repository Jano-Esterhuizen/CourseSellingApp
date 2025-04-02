import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useBasket } from "../context/BasketContext";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const { addToBasket } = useBasket();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddToBasket = async () => {
    try {
      await api.post("/basket", { courseId: course.id });
      setMessage("Course added to basket!");
    } catch (err) {
      setMessage("Failed to add course.");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <img src={`http://localhost:5025${course.thumbnailUrl}`} alt={course.title} className="w-64 rounded mt-2" />
      <p className="text-gray-300 mt-4">{course.description}</p>
      <p className="text-green-400 font-semibold mt-2">R{course.price}</p>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
        onClick={() => addToBasket(course)}
      >
        Add to Basket
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
