import React from "react";
import { Sparkles, CheckCircle, ArrowRight, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const LimitedSlot = () => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate("/signature-new-cart-supabase", { state: { scrollToTop: true } });
  };

  const finalBenefits = [
    { text: "Handcrafted by expert designers" },
    { text: "One-time payment, lifetime value" },
    { text: "Full package with tutorials included" },
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <Sparkles className="w-7 h-7 text-yellow-400" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
            Become Unforgettable
          </h2>
        </div>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your signature is the most personal piece of your brand. Don't settle
          for average. Invest in an identity that makes a lasting impression.
        </p>

        {/* The Main Offer Card */}
        <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 text-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-yellow-200 transform hover:scale-105 transition-all duration-500">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 border border-red-300 rounded-full px-6 py-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase text-red-700 tracking-wider">
                Limited Weekly Slots
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-800">
              Only 7 Spots Available This Week
            </h3>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We limit our client intake to ensure every signature receives the
              personal attention and quality craftsmanship it deserves.
            </p>
          </div>

          {/* Key Benefits List */}
          <div className="space-y-4 text-left max-w-md mx-auto mb-10">
            {finalBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-white/50 rounded-xl border border-yellow-200"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* The New, Clean CTA Button */}
          <button
            onClick={handleCTAClick}
            className="group w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 border border-yellow-400"
          >
            <span className="mr-3">Secure Your Spot Now</span>
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
          </button>

          {/* Trust/Security Message */}
          <div className="flex items-center justify-center gap-3 mt-6 text-gray-600">
            <Lock className="w-5 h-5 text-green-600" />
            <span className="font-medium">
              Secure One-Time Payment • SSL Protected
            </span>
          </div>
        </div>

        {/* Footer Links - Placed cleanly outside the main CTA card */}
        <div className="mt-10 flex justify-center gap-6 text-sm">
          <Link
            to="/privacy"
            className="text-gray-600 hover:text-yellow-600 transition-colors duration-300 font-medium"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-500">•</span>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-yellow-600 transition-colors duration-300 font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LimitedSlot;
