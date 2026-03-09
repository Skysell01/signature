import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import SignatureCTA from "./SignatureCTA";
import { Link } from "react-router-dom";

const SignatureLimitedSlots = () => {
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full px-6 py-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800 font-secondary">
              Limited Availability
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-800 mb-6">
            ⚠️ Limited Weekly Slots
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-primary">
            Only 7 signature slots available each week to maintain quality
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className={`bg-white rounded-2xl p-4 shadow-lg border border-gray-200 transition-all duration-1000 delay-300 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left Side - Urgency Info */}
            <div className="space-y-6 px-2">
              <div className="space-y-2 flex flex-col items-center justify-center">
                <div className="flex space-x-4 items-center">
                  <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-full p-2 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-800">
                    Act Now
                  </h3>
                </div>
                <p className="text-gray-600 font-primary text-center">
                  Once full, new orders are pushed to next week
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">
                    No monthly subscription
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">
                    One-time payment, lifetime impact
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">
                    Premium quality over quantity
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="text-center lg:text-left">
              <div className="bg-gray-600 rounded-xl p-4 text-white">
                <h4 className="text-xl font-display font-bold mb-2 mt-1">
                  Don't Miss Your Chance
                </h4>
                <p className="text-gray-300 mb-2 font-primary">
                  Secure your slot before they're gone for the week
                </p>
              </div>
            </div>

            <SignatureCTA size="small" className="text-sm" />
          </div>
        </div>

        {/* Bottom Stats + Simple Buttons */}
        <div className="w-full max-w-5xl mx-auto">
          <div
            className={`grid grid-cols-3 gap-6 mt-8 transition-all duration-1000 delay-500 transform ${
              animateElements
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium mb-1">
                Weekly Slots
              </div>
              <div className="text-3xl font-bold text-gray-800">7</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium mb-1">
                Hours Delivery
              </div>
              <div className="text-3xl font-bold text-gray-800">24-48</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium mb-1">
                Design Options
              </div>
              <div className="text-3xl font-bold text-gray-800">3</div>
            </div>

            {/* Buttons row */}
            <div className="col-span-3 flex flex-row items-center justify-center gap-3 mt-2">
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureLimitedSlots;
