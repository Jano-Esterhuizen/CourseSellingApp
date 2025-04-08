import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { basketService, paymentsService } from '../api/services';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { StarBorder } from '../components/ui/star-border';

interface BasketItem {
  courseId: string;
  title: string;
  price: number;
  instructor: string;
}

interface Basket {
  items: BasketItem[];
  totalPrice: number;
}

export function BasketPage() {
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
      console.log('Basket data:', data);
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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);
      const { url } = await paymentsService.createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      toast.error('Failed to initiate checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Basket</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {basket && basket.items.length > 0 ? (
          <div className="space-y-6">
            {basket.items.map((item) => (
              <div
                key={item.courseId}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 flex items-center justify-between hover:border-white/20 transition-all duration-300"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.instructor}</p>
                  <p className="text-purple-400 font-semibold">${item.price}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.courseId)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-purple-400">
                  ${basket.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center space-x-4">
                <button
                  onClick={handleClearBasket}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isProcessing}
                >
                  Clear Basket
                </button>
                <StarBorder 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </StarBorder>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
            <p className="text-gray-400 mb-4">Your basket is empty</p>
            <StarBorder as="a" href="/courses">
              Browse Courses
            </StarBorder>
          </div>
        )}
      </div>
    </div>
  );
} 