import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Star, Sparkles, PhoneCall, ArrowLeft, FileText } from 'lucide-react';
import SignatureNavbar from '../components/signature/SignatureNavbar';
import SignatureCTA from '../components/signature/SignatureCTA';

const SignatureOrderConfirmation = () => {
  // const { orderId, amount } = useLocation().state;

// const location = useLocation();
// const orderId = "1234567890";
const amount = 1000;
// const { orderId, amount } = location.state || {};
if (!orderId) {
  navigate("/signature-cart");
}
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 selection:bg-gray-500/20 selection:text-gray-800">
      <SignatureNavbar />
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-white/30 to-blue-100/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)]"></div>

        {/* Floating Signature Elements */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <FileText 
              className={`w-2 h-2 ${i % 3 === 0 ? 'text-gray-400' : i % 3 === 1 ? 'text-blue-400' : 'text-black'} opacity-60`}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/20 via-black/20 to-gray-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white/25 backdrop-blur-xl rounded-full p-6 border border-white/30 shadow-xl">
              <CheckCircle className="w-16 h-16 text-gray-800 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/25 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
              <span className="text-gray-700 text-sm font-medium font-primary">Order Confirmed</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight font-display">
              <span className="text-gray-800">Thank You!</span>
              <span className="bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent pl-2">Signature Design Ordered</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-primary">
              Your Professional Signature Design has been successfully ordered. Our expert designer will create your personalized signature and deliver it within 24-48 hours.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-gray-500/20 via-black/20 to-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/25 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/30 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 font-display">Order Details</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-gray-800 fill-current" />
                    <Star className="w-4 h-4 text-gray-800 fill-current" />
                    <Star className="w-4 h-4 text-gray-800 fill-current" />
                    <Star className="w-4 h-4 text-gray-800 fill-current" />
                    <Star className="w-4 h-4 text-gray-800 fill-current" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-primary">Order ID</p>
                    <p className="text-gray-800 font-mono">{orderId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-primary">Service</p>
                    <p className="text-gray-800 font-primary">Professional Signature Design</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-primary">Amount Paid</p>
                    <p className="text-gray-800 font-semibold">₹{amount}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-primary">Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium font-primary">Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-800 font-display">What's Next?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-black/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                  <h4 className="text-gray-800 font-semibold mb-2 font-display">Design Analysis</h4>
                  <p className="text-gray-600 text-sm font-primary">Our expert will analyze your personality and create unique designs</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-black/20 to-gray-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-gray-800 font-semibold mb-2 font-display">Personalized Design</h4>
                  <p className="text-gray-600 text-sm font-primary">Receive your custom signature design in multiple formats</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-black/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-gray-800 font-semibold mb-2 font-display">Professional Guidance</h4>
                  <p className="text-gray-600 text-sm font-primary">Get tips on using your new signature effectively</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/signature" className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-white/25 to-white/15 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <button className="relative bg-white/25 backdrop-blur-xl rounded-full border border-white/30 shadow-xl text-gray-800 px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-primary">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </Link>
            
            <SignatureCTA 
              text="Order Another Design" 
              className="w-full sm:w-auto"
            />
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4 pt-8 border-t border-white/30">
            <p className="text-gray-600 text-sm font-primary">
              Need immediate assistance? Contact us at{' '}
              <span className="text-gray-800 font-medium">support@easysoul.com</span>
            </p>
            <p className="text-gray-500 text-xs font-primary">
              You will receive a confirmation email shortly with all the details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureOrderConfirmation; 