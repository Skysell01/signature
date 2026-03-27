import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignatureCTA = ({
  size = "large",
  className = "",
  width = "100%",
  title = "Get My Signature Now",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    // Navigate to signature cart
    navigate("/signature-cart-cashfree", { state: { scrollToTop: true } });
  };

  const isSmall = size === "small";
  const buttonClasses = isSmall
    ? `group relative flex items-center justify-center px-6 py-4 text-sm font-semibold text-white bg-black rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden border border-gray-300 ${className}`
    : `group relative flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-black rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden border border-gray-300 ${className}`;

  const textSize = "text-base";

  const signatureSize = isSmall ? "w-8 h-6" : "w-12 h-8";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={buttonClasses}
      style={{ width: width }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-black opacity-100 group-hover:opacity-90 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

      {/* Content container */}
      <div className="relative flex items-center space-x-3 z-10">
        {/* Animated signature */}
        <div className={`${signatureSize} relative`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
          >
            {/* Signature path */}
            <path
              d="M10,15 Q20,5 30,15 Q40,25 50,15 Q60,5 70,15 Q80,25 90,15"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="opacity-100"
              style={{
                strokeDasharray: "100",
                strokeDashoffset: "100",
                animation: "signatureDraw 3s ease-in-out infinite",
              }}
            />

            {/* Pen tip dot */}
            <circle
              cx="10"
              cy="15"
              r="1"
              fill="white"
              style={{
                animation: "penMove 3s ease-in-out infinite",
              }}
            />
          </svg>
        </div>

        {/* Button text with glow */}
        <span
          className={`relative font-display font-semibold ${textSize} transition-all duration-300 ${
            isHovered ? "text-gray-200 drop-shadow-lg" : "text-white"
          }`}
        >
          {title}
        </span>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute w-2 h-2 text-gray-400 transition-all duration-1000 ${
              isHovered ? "opacity-100 animate-bounce" : "opacity-0"
            }`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle dots effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gray-500 rounded-full transition-all duration-700 ${
              isHovered ? "opacity-100 animate-pulse" : "opacity-0"
            }`}
            style={{
              left: `${25 + i * 15}%`,
              top: `${35 + (i % 2) * 30}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Click ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-white opacity-40 rounded-2xl animate-ping"></div>
      )}

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Inner glow */}
      <div className="absolute inset-1 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Custom CSS animations for infinite signature */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes signatureDraw {
            0% {
              stroke-dashoffset: 100;
            }
            50% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: 100;
            }
          }
          
          @keyframes penMove {
            0% {
              cx: 10;
            }
            50% {
              cx: 90;
            }
            100% {
              cx: 10;
            }
          }
        `,
        }}
      />
    </button>
  );
};

export default SignatureCTA;
