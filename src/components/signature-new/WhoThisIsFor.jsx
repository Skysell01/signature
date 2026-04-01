import React, { useState } from "react";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Palette,
  Mail,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccordionItem = ({ item, isOpen, onToggle, index }) => {
  const Icon = item.icon;

  return (
    <div className="border border-yellow-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-inset"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 pt-2">
          <div className="pl-14">
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhoThisIsFor = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default
  const navigate = useNavigate();

  const targetAudience = [
    {
      icon: GraduationCap,
      title: "Students & Freshers",
      subtitle: "starting their career",
      description:
        "Make a strong first impression with a professional signature that sets you apart from the crowd. Perfect for job applications, internships, and building your professional identity from day one.",
    },
    {
      icon: Building2,
      title: "Business Owners",
      subtitle: "who want to stand out",
      description:
        "Elevate your brand with a signature that reflects your business's professionalism and values. Create a memorable mark that reinforces your company's credibility in every document you sign.",
    },
    {
      icon: Briefcase,
      title: "Working Professionals",
      subtitle: "upgrading their image",
      description:
        "Transform your professional presence with a signature that commands respect and attention. Whether you're signing contracts, emails, or important documents, make every signature count.",
    },
    {
      icon: Palette,
      title: "Creatives",
      subtitle: "who value aesthetics",
      description:
        "Express your artistic vision through a signature that's as unique and beautiful as your work. Perfect for designers, artists, and anyone who appreciates the power of visual identity.",
    },
    {
      icon: Mail,
      title: "Anyone Tired of Basic Signatures",
      subtitle: "or inconsistent handwriting",
      description:
        "Upgrade from messy handwriting to a signature that represents the best version of yourself. Say goodbye to embarrassing scribbles and hello to a signature you'll be proud to use anywhere.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white border border-yellow-200 rounded-full px-6 py-3 mb-6 shadow-sm">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              Perfect For
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Who Is This For?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional signature design for everyone who wants to make their
            mark
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {targetAudience.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-6 border border-yellow-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Ready to Create Your Perfect Signature?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who've transformed their image
              with a custom signature
            </p>
            <button
              onClick={() => navigate("/signature-new-cart-supabase")}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
