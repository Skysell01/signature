import React, { useState, useEffect } from "react";
import { Shield, Briefcase, PenTool, Smartphone, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhyChooseUs = () => {
  const [animateElements, setAnimateElements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateElements(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Add custom styles for enhanced aesthetics
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
            .timeline-connector {
                background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                position: relative;
            }
            
            .timeline-connector::before {
                content: '';
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 6px;
                height: 100%;
                background: linear-gradient(180deg, transparent 0%, #fbbf24 20%, #f59e0b 80%, transparent 100%);
                border-radius: 3px;
            }
            
            .benefit-card {
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(251, 191, 36, 0.2);
                box-shadow: 0 10px 30px rgba(251, 191, 36, 0.1), 0 0 0 1px rgba(255,255,255,0.1) inset;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .benefit-card:hover {
                background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 100%);
                box-shadow: 0 20px 50px rgba(251, 191, 36, 0.15), 0 0 0 1px rgba(255,255,255,0.2) inset;
                transform: translateY(-8px) scale(1.02);
            }
            
            .icon-container {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
                transition: all 0.3s ease;
            }
            
            .benefit-card:hover .icon-container {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                box-shadow: 0 12px 35px rgba(251, 191, 36, 0.4);
                transform: scale(1.1) rotate(5deg);
            }
            
            .timeline-dot {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2), 0 0 20px rgba(251, 191, 36, 0.3);
                animation: pulse 2s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { 
                    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2), 0 0 20px rgba(251, 191, 36, 0.3);
                }
                50% { 
                    box-shadow: 0 0 0 8px rgba(251, 191, 36, 0.1), 0 0 30px rgba(251, 191, 36, 0.4);
                }
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const uspPoints = [
    {
      icon: Shield,
      title: "Expert Designers",
      description:
        "Handcrafted by professional signature designers, not AI-generated. Every signature is meticulously crafted to reflect your unique personality and professional image.",
      highlight: "100% Human-Crafted",
    },
    {
      icon: Briefcase,
      title: "Career-Focused",
      description:
        "Built to enhance your professional image across all documents. From contracts to emails, make every signature count in your career advancement.",
      highlight: "Professional Impact",
    },
    {
      icon: PenTool,
      title: "Elegant & Readable",
      description:
        "Perfect balance of aesthetics and readability for maximum impact. Beautiful enough to impress, clear enough to be legally recognized.",
      highlight: "Perfectly Balanced",
    },
    {
      icon: Smartphone,
      title: "Digital Delivery",
      description:
        "Instant delivery ready to use on all your devices. Compatible with all major platforms and document signing software.",
      highlight: "Instant Access",
    },
    {
      icon: Gift,
      title: "Personal Attention",
      description:
        "One-on-one attention ensuring your signature reflects your personality. We work with you until you're completely satisfied with the result.",
      highlight: "Personalized Service",
    },
  ];

  const BenefitCard = ({ point, index, isLast }) => {
    return (
      <div className="relative">
        {/* Timeline Dot */}
        {/* <div className="absolute left-6 top-32 w-4 h-4 timeline-dot rounded-full z-10"></div> */}

        {/* Timeline Connector Line */}
        {/* {!isLast && (
          <div className="absolute left-7 top-36 w-0.5 h-32 timeline-connector"></div>
        )} */}

        {/* Benefit Card */}
        <div
          className={`items-center justify-center transition-all duration-1000 delay-${
            (index + 1) * 200
          } transform ${
            animateElements
              ? "translate-x-0 opacity-100"
              : "translate-x-12 opacity-0"
          }`}
        >
          <div className="benefit-card rounded-2xl p-8 mb-8">
            {/* Icon and Title Row */}
            <div className="flex flex-col items-start mb-8">
              <div className="flex items-center justify-between w-full mb-8">
                <div className="icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
                  <point.icon className="w-8 h-8 text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {point.highlight}
                </span>
              </div>

              <div className="w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {point.description}
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            {/* <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Benefit {index + 1} of {uspPoints.length}
              </span>
              <div className="flex space-x-1">
                {uspPoints.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= index ? "bg-amber-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-6 px-6 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Professional signature design that elevates your personal brand and
            makes a lasting impression
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full mx-4"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent w-32"></div>
          </div>
        </div>

        {/* Timeline of Benefits */}
        <div className="relative pb-12">
          {uspPoints.map((point, index) => (
            <BenefitCard
              key={index}
              point={point}
              index={index}
              isLast={index === uspPoints.length - 1}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center transition-all duration-1000 delay-1200 transform ${
            animateElements
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-8 border border-yellow-200/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Ready to Elevate Your Professional Image?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their
              personal brand with our signature design service
            </p>
            <button
              onClick={() => navigate("/signature-new-cart-supabase")}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Your Signature Design
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
