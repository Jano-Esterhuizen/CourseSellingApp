// src/context/BasketContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios"; // Make sure you're using your axios instance

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const res = await api.get("/basket");
        setBasket(res.data.items || []);
      } catch (err) {
        console.error("Failed to load basket:", err);
      }
    };

    fetchBasket();
  }, []);

  const addToBasket = async (course) => {
    try {
      // Sync to backend
      await api.post(`/basket/add/${course.id}`);
  
      // Update frontend state (to show basket content immediately)
      if (!basket.find((item) => item.id === course.id)) {
        setBasket([...basket, course]);
      }
    } catch (err) {
      console.error("Failed to add course to basket:", err);
    }
  };

  const removeFromBasket = async (courseId) => {
    try {
      await api.delete(`/basket/remove/${courseId}`);
      setBasket(basket.filter((item) => item.id !== courseId));
    } catch (err) {
      console.error("Failed to remove course from basket:", err);
    }
  };

  const clearBasket = async () => {
    try {
      await api.delete(`/basket/clear`);
      setBasket([]);
    } catch (err) {
      console.error("Failed to clear basket:", err);
    }
  };

  const totalPrice = basket.reduce((sum, item) => sum + item.price, 0);

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, clearBasket, totalPrice }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);
