import React, { useState, useEffect } from "react";
import { Menu, Signature, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".navbar-container") &&
        !event.target.closest(".mobile-menu-overlay")
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className={` fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border border-yellow-300/50 shadow-lg shadow-yellow-200/20"
            : "bg-gradient-to-r from-yellow-50/80 via-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-yellow-200/30"
        } rounded-2xl`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/logoT.png"
              alt="Easy Soul Logo"
              className="w-32 h-13 object-cover"
            />
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Button - Hidden on mobile */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate("/signature-new-cart-supabase")}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-900" />
            ) : (
              <Menu className="w-5 h-5 text-gray-900" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-yellow-50/95 via-amber-50/95 to-orange-50/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-yellow-200/30">
            <div className="p-6 pt-20">
              {/* Menu Items */}
              <div className="space-y-1 px-4">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-yellow-100/50 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-4 mt-6">
                <button
                  onClick={() => navigate("/signature-new-cart-supabase")}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  Get Started
                </button>
              </div>

              {/* Contact Info */}
              <div className="px-4 mt-4 pt-4 border-t border-yellow-200/40">
                <p className="text-sm text-gray-600 text-center">
                  Ready to upgrade your signature?
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Professional • Fast • Affordable
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content overlap */}
      <div className="h-20 md:h-24 " />
    </>
  );
};

export default Navbar;
