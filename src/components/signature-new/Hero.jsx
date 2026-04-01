import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  Download,
  Star,
  Users,
  Award,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Shield,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animated feature card with modern design
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div
    className={`bg-white/60 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-6 hover:bg-white/80 hover:border-yellow-300/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-200/20`}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-gradient-to-br from-yellow-400/30 to-amber-400/30 w-12 h-12 rounded-xl flex items-center justify-center mr-6">
        <Icon className="w-6 h-6 text-amber-700" />
      </div>
      <h2 className="text-gray-800 font-bold text-xl mb-2">{title}</h2>
    </div>
    <p className="text-center text-gray-600 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

// Stats card with neon glow effect
const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="relative group">
    <div
      className={`absolute inset-0 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
    ></div>
    <div className="relative bg-white/60 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-6 text-center hover:bg-white/80 hover:border-yellow-300/60 transition-all duration-300 h-32 flex flex-col justify-center">
      <Icon className={`w-8 h-8 mx-auto mb-3 text-${color}-400`} />
      <div className="text-2xl font-bold text-amber-700 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  </div>
);

// Signature showcase with parallax effect
const SignatureShowcase = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      className="relative bg-gradient-to-br from-white/80 via-yellow-50/80 to-amber-50/80 rounded-3xl p-8 border border-yellow-200/50 overflow-hidden group shadow-lg shadow-yellow-200/20"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
            mousePosition.y * 100
          }%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-yellow-400/30 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-300/50">
          <Sparkles className="w-4 h-4" />
          <span>Sample Signature</span>
        </div>

        <div className="font-signature text-5xl md:text-6xl text-gray-800 mb-4 transform group-hover:scale-105 transition-transform duration-500">
          <img src="/signature-1.png" alt="" />
        </div>

        <p className="text-gray-600 text-sm">
          Your custom signature will be uniquely crafted for you
        </p>
      </div>

      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
    </div>
  );
};

// Trust indicators with animated avatars
const TrustIndicators = () => {
  const avatars = [
    "https://i.pravatar.cc/40?img=11",
    "https://i.pravatar.cc/40?img=25",
    "https://i.pravatar.cc/40?img=33",
    "https://i.pravatar.cc/40?img=47",
    "https://i.pravatar.cc/40?img=55",
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-6 hover:bg-white/80 hover:border-yellow-300/60 transition-all duration-300 shadow-lg shadow-yellow-200/20">
      <div className="flex items-center justify-between">
        <div className="flex -space-x-3">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Professional ${index + 1}`}
              className="w-10 h-10 rounded-full border-2 border-yellow-300 hover:scale-110 transition-transform duration-300 hover:z-10 relative"
              style={{ animationDelay: `${index * 200}ms` }}
            />
          ))}
        </div>
        <div className="text-right">
          <div className="text-gray-800 font-semibold">
            2,500+ Professionals
          </div>
          <div className="text-amber-600 text-sm">Trust Our Signatures</div>
        </div>
      </div>
    </div>
  );
};

const SignatureHeroRedesigned = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Crown,
      title: "3 Designer Options",
      description:
        "Unique signature variations crafted by professional designers",
      color: "purple",
      delay: 0,
    },
    {
      icon: Zap,
      title: "Writing Tutorial",
      description: "Step-by-step video guide to master your new signature",
      color: "blue",
      delay: 100,
    },
    {
      icon: Download,
      title: "Practice Sheets",
      description: "PDF practice sheets for perfecting your signature",
      color: "green",
      delay: 200,
    },
    {
      icon: Timer,
      title: "24-48hr Delivery",
      description: "Fast turnaround via email delivery",
      color: "orange",
      delay: 300,
    },
  ];

  const stats = [
    { icon: Users, value: "2,500+", label: "Happy Clients", color: "blue" },
    { icon: Star, value: "4.9/5", label: "Rating", color: "yellow" },
    { icon: Shield, value: "24hrs", label: "Delivery", color: "green" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-100 relative overflow-hidden pb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-orange-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 py-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 text-amber-800 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-yellow-400/50">
            <Sparkles className="w-4 h-4" />
            <span>Transform Your Identity</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-800">Craft Your Perfect</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Digital Signature
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Elevate your personal brand with a handcrafted, designer signature
            that reflects your style, ambition, and profession.
          </p>
        </div>
        <div className="flex justify-center items-center mb-6">
          <img
            src="/signature-hero.webp"
            alt="signature"
            className="w-full h-1/2 rounded-lg"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold  text-gray-800 mb-8 text-center flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-600 mr-3" />
                What You'll Receive
              </h2>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>

          {/* Right Column - Showcase & Pricing */}
          <div className="space-y-6">
            {/* Signature Showcase */}
            <SignatureShowcase />

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-6 border border-yellow-200/50 relative overflow-hidden shadow-lg shadow-yellow-200/20">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-400/5"></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-red-300/30">
                  <Timer className="w-4 h-4" />
                  <span>Limited Time Offer</span>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">₹489</span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹4,999
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    51% OFF
                  </span>
                </div>

                <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-4 mb-6">
                  <p className="text-red-700 font-semibold flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Only 7 slots available per week!
                  </p>
                </div>

                <button
                  onClick={() => navigate("/signature-new-cart-supabase")}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <Crown className="w-5 h-5" />
                  <span>Get Your Designer Signature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <TrustIndicators />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureHeroRedesigned;
