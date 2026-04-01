import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CtaButton = ({
  size = "large",
  className = "",
  width = "auto",
  title = "Secure Your Spot Now",
  variant = "primary",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    navigate("/signature-new-cart-supabase", { state: { scrollToTop: true } });
  };

  const isSmall = size === "small";

  const baseClasses =
    "group relative inline-flex items-center justify-center font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 overflow-hidden";

  const sizeClasses = isSmall ? "px-6 py-3 text-base" : "px-10 py-5 text-xl";

  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white focus:ring-yellow-300 border border-yellow-400"
      : "bg-gradient-to-r from-gray-800 to-gray-900 text-white focus:ring-gray-300 border border-gray-600";

  const buttonClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={buttonClasses}
      style={{ width: width }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Content container */}
      <div className="relative flex items-center space-x-3 z-10">
        {/* Animated sparkle */}
        <Sparkles
          className={`w-5 h-5 transition-all duration-300 ${
            isHovered ? "animate-pulse text-yellow-200" : "text-yellow-300"
          }`}
        />

        {/* Button text */}
        <span className="relative font-display font-bold transition-all duration-300">
          {title}
        </span>

        {/* Animated arrow */}
        <ArrowRight
          className={`w-6 h-6 transition-transform duration-300 ${
            isHovered ? "translate-x-2" : ""
          }`}
        />
      </div>

      {/* Click ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-white opacity-30 rounded-2xl animate-ping"></div>
      )}

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-yellow-200 rounded-full transition-all duration-700 ${
              isHovered ? "opacity-100 animate-bounce" : "opacity-0"
            }`}
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Inner glow */}
      <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </button>
  );
};

export default CtaButton;
