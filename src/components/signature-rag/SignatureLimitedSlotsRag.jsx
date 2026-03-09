import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import SignatureCTAButton from "./SignatureCTAButton";
import { Link } from "react-router-dom";

const SignatureLimitedSlotsRag = () => {
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 transform ${
            animateElements ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center space-x-2 bg-red-100 border-2 border-red-300 rounded-full px-6 py-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800 font-secondary">
              Limited Availability
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-display font-bold text-blue-900 mb-6">
            ⚠️ Limited Weekly Slots
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto font-primary">
            Only 7 signature slots available each week to maintain quality
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className={`bg-blue-50 rounded-2xl p-4 shadow-lg border-2 border-blue-200 transition-all duration-1000 delay-300 transform ${
            animateElements ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left Side - Urgency Info */}
            <div className="space-y-6 px-2">
              <div className="space-y-2 flex flex-col items-center justify-center">
                <div className="flex space-x-4 items-center">
                  <div className="bg-red-500 rounded-full p-2 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-blue-900">Act Now</h3>
                </div>
                <p className="text-blue-700 font-primary text-center">
                  Once full, new orders are pushed to next week
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-700 font-medium">No monthly subscription</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-700 font-medium">One-time payment, lifetime impact</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-700 font-medium">Premium quality over quantity</span>
                </div>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="text-center lg:text-left">
              <div className="bg-blue-100 rounded-xl p-4 border border-blue-300">
                <h4 className="text-xl font-display font-bold mb-2 mt-1 text-blue-900">Don't Miss Your Chance</h4>
                <p className="text-blue-700 mb-2 font-primary">
                  Secure your slot before they're gone for the week
                </p>
              </div>
            </div>

            <SignatureCTAButton text="Get My Signature Now" className="text-sm" />
          </div>
        </div>

        {/* Bottom Stats + Simple Buttons */}
    <div className="w-full max-w-5xl mx-auto">
      <div
        className={`grid grid-cols-3 gap-6 mt-8 transition-all duration-1000 delay-500 transform ${
          animateElements ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Stat 1 */}
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-1">Weekly Slots</div>
          <div className="text-3xl font-bold text-blue-900">7</div>
        </div>

        {/* Stat 2 */}
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-1">Hours Delivery</div>
          <div className="text-3xl font-bold text-blue-900">24-48</div>
        </div>

        {/* Stat 3 */}
        <div className="text-center">
          <div className="text-sm text-blue-600 font-medium mb-1">Design Options</div>
          <div className="text-3xl font-bold text-blue-900">5</div>
        </div>

        {/* Buttons row */}
        <div className="col-span-3 flex flex-row items-center justify-center gap-3 mt-2">
          <Link
            to="/privacy"
            className="inline-flex items-center justify-center px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Privacy Policy
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Contact Us
          </Link>
         <Link
            to="/contact"
            className="inline-flex items-center justify-center px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
             About
          </Link>
        </div>
      </div>
    </div>

      </div>
    </section>
  );
};

export default SignatureLimitedSlotsRag;
