import React from "react";
import { useBasket } from "../context/BasketContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BasketPage() {
    const { basket, removeFromBasket, totalPrice } = useBasket();
    const navigate = useNavigate();
    const { clearBasket } = useBasket();

    const handleCheckout = async () => {
        try {
            await api.post("/orders/checkout"); // no body needed, user ID is taken from token
            clearBasket();
            alert("Order placed successfully!");
            navigate("/my-courses"); // go to "My Courses" page
        } catch (err) {
            console.error("Checkout failed", err);
            alert("Something went wrong.");
        }
    };


    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Your Basket</h2>

            {basket.length === 0 ? (
                <p>Your basket is empty.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {basket.map((item) => (
                            <li key={item.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                </div>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => removeFromBasket(item.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 text-right font-semibold">
                        Total: ${totalPrice.toFixed(2)}
                    </div>

                    <div className="text-right mt-4">
                        <button
                            onClick={handleCheckout}
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                </>
            )}

            <div className="mt-6">
                <Link to="/courses" className="text-blue-600 hover:underline">
                    ← Back to Courses
                </Link>
            </div>
        </div>
    );
}
