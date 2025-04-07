import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { basketService, paymentsService } from '../api/services';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Update the interface to match the actual API response
interface BasketItem {
  id?: string;
  courseId: string;
  quantity?: number;
  // Course properties directly on the item
  title: string;
  description?: string;
  price: number;
  instructor?: string;
  imageUrl?: string;
}

interface Basket {
  id: string;
  userId: string;
  totalPrice: number;
  items: BasketItem[];
}

export function BasketPage() {
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBasket();
  }, [isAuthenticated, navigate]);

  const fetchBasket = async () => {
    try {
      const data = await basketService.getBasket();
      console.log('Basket data:', data); // Debug log
      if (data && typeof data === 'object' && 'items' in data) {
        setBasket(data as Basket);
      } else {
        console.error('Unexpected basket data format:', data);
        setBasket(null);
        toast.error('Error loading basket data');
      }
    } catch (err) {
      console.error('Error fetching basket:', err);
      setError('Failed to load basket');
      toast.error('Failed to load basket');
      setBasket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId: string) => {
    if (!courseId) {
      console.error('Cannot remove item: courseId is undefined');
      toast.error('Could not remove item: invalid ID');
      return;
    }

    try {
      await basketService.removeItem(courseId);
      toast.success('Item removed from basket');
      await fetchBasket();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
      toast.error('Failed to remove item');
    }
  };

  const handleClearBasket = async () => {
    try {
      await basketService.clearBasket();
      setBasket(null);
      toast.success('Basket cleared');
    } catch (err) {
      console.error('Error clearing basket:', err);
      setError('Failed to clear basket');
      toast.error('Failed to clear basket');
    }
  };

  const handleCheckout = async () => {
    try {
      const { url } = await paymentsService.createCheckoutSession();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      setError('Failed to initiate checkout');
      toast.error('Failed to initiate checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Basket</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!basket || !basket.items || basket.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your basket is empty</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-800"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {basket.items.map((item) => (
              <div
                key={`${item.courseId}`}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || '/placeholder-image.jpg'}
                    alt={item.title || 'Course Image'}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold">{item.title || 'Untitled Course'}</h3>
                    <p className="text-gray-600">{item.instructor || 'Unknown Instructor'}</p>
                    <p className="text-blue-600 font-semibold">
                      ${item.price || 0}
                      {item.quantity && item.quantity > 1 && ` × ${item.quantity}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.courseId)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${basket.totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={handleClearBasket}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear Basket
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 