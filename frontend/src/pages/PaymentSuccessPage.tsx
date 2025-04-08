import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If accessed via HTTPS, redirect to HTTP
    if (window.location.protocol === 'https:') {
      window.location.href = 'http://localhost:5173/payment-success';
      return;
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your courses are now ready for you to start learning.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/my-courses">
            <Button className="w-full group" size="lg">
              Go to My Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full" size="lg">
              Return to Homepage
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Having issues? Contact our support team for assistance.</p>
        </div>
      </Card>
    </div>
  );
} 