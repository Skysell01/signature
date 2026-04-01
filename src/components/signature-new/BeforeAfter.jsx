import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BeforeAfter = () => {
  const navigate = useNavigate();
  // Add custom styles for handwriting font and enhanced aesthetics
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
            
            .font-handwriting {
                font-family: 'Kalam', cursive;
            }
            
            .signature-card {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(251, 191, 36, 0.2);
                box-shadow: 0 20px 40px rgba(251, 191, 36, 0.1), 0 0 0 1px rgba(255,255,255,0.1) inset;
            }
            
            .signature-card:hover {
                background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%);
                box-shadow: 0 30px 60px rgba(251, 191, 36, 0.15), 0 0 0 1px rgba(255,255,255,0.2) inset;
                transform: translateY(-8px) scale(1.02);
            }
            
            .before-card {
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border: 2px solid #fecaca;
                position: relative;
                overflow: hidden;
            }
            
            .before-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(239, 68, 68, 0.05) 50%, transparent 70%);
                animation: shimmer 3s ease-in-out infinite;
            }
            
            .after-card {
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border: 2px solid #bbf7d0;
                position: relative;
                overflow: hidden;
            }
            
            .after-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(34, 197, 94, 0.05) 50%, transparent 70%);
                animation: shimmer 3s ease-in-out infinite reverse;
            }
            
            @keyframes shimmer {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
            }
            
            .arrow-bounce {
                animation: bounce 2s ease-in-out infinite;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(10px); }
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateElements(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Transformation examples with before text and after signature images
  const transformations = [
    {
      id: 1,
      beforeText: "/sign-4.jpg",
      beforeDescription: "Basic, forgettable name writing",
      afterImage: "/signature-1.png",
      afterDescription: "Bold, professional signature",
      title: "From Basic to Bold",
      benefit: "Stand out with confidence and authority",
    },
    {
      id: 2,
      beforeText: "/sign-5.jpg",
      beforeDescription: "Cluttered, hard to read",
      afterImage: "/signature-2.png",
      afterDescription: "Clean, elegant design",
      title: "From Cluttered to Clean",
      benefit: "Create clarity and professionalism",
    },
    {
      id: 3,
      beforeText: "/sign-6.jpg",
      beforeDescription: "Forgettable, plain text",
      afterImage: "/signature-3.png",
      afterDescription: "Memorable, distinctive mark",
      title: "From Forgettable to Flawless",
      benefit: "Make a lasting impression",
    },
  ];

  const ComparisonCard = ({ transformation, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`transition-all duration-1000 delay-${
          (index + 1) * 200
        } transform ${
          animateElements
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="signature-card rounded-2xl p-8 transition-all duration-500">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {transformation.title}
            </h3>
            <p className="text-amber-600 font-medium">
              {transformation.benefit}
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* BEFORE - Text Card */}
            <div className="space-y-4">
              <div className="before-card rounded-xl p-6 text-center">
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  BEFORE
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-red-300 min-h-[120px] flex items-center justify-center">
                  <img
                    src={transformation.beforeText}
                    alt={`Original handwriting ${transformation.id}`}
                    className="max-w-full w-80 max-h-24 object-cover"
                  />
                  <div className="text-gray-800 text-xl hidden">
                    Original handwriting
                  </div>
                </div>
                <div className="text-red-600 text-sm">
                  {transformation.beforeDescription}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div
                className={`transition-all duration-500 ${
                  isHovered ? "scale-110 rotate-12" : "arrow-bounce"
                }`}
              >
                <ArrowRight className="w-8 h-8 text-amber-600" />
              </div>
            </div>

            {/* AFTER - Signature Image */}
            <div className="space-y-4">
              <div className="after-card rounded-xl p-6 text-center">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  AFTER
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-300 min-h-[120px] flex items-center justify-center">
                  <img
                    src={transformation.afterImage}
                    alt={`Professional signature transformation ${transformation.id}`}
                    className="max-w-full w-80 max-h-24 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="text-green-600 text-sm hidden">
                    Professional Signature Design
                  </div>
                </div>
                <div className="text-green-600 text-sm mt-2">
                  {transformation.afterDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Vertical Stack */}
          <div className="md:hidden mt-6">
            <div className="flex items-center justify-center space-x-4 text-amber-600">
              <div className="h-px bg-amber-300 flex-1"></div>
              <span className="text-sm font-medium">Transformation</span>
              <div className="h-px bg-amber-300 flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-4 py-8 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-800 mb-6">
            ✍️ Signature Transformations
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            See how we transform ordinary name writing into powerful,
            professional signatures that make a lasting impression
          </p>
        </div>

        {/* Transformation Cards */}
        <div className="space-y-8">
          {transformations.map((transformation, index) => (
            <ComparisonCard
              key={transformation.id}
              transformation={transformation}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-1000 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-6 border border-yellow-200/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready for Your Signature Transformation?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who have elevated their personal
              brand with a custom signature design
            </p>
            <button
              onClick={() => navigate("/signature-new-cart-supabase")}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Transformation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
