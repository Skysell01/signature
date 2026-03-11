import React from 'react';
import SignatureCTA from './SignatureCTA';

const SignatureFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-2">
  <span className="text-gray-400 line-through text-sm">₹4,999</span>
  <span
    className="text-xl font-bold text-gray-800 relative"
    style={{
      textShadow: "0 0 8px rgba(255, 215, 0, 0.8), 0 0 12px rgba(255, 215, 0, 0.6)"
    }}
  >
    ₹489
  </span>
</div>

              <span className="text-xs text-red-600 font-medium">Last 2 slots left</span>
            </div>
            {/* <a
              href="/privacy#delivery-policy"
              className="inline-block text-gray-800 underline underline-offset-4 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-1 transition-colors"
            >
              Privacy 
            </a> */}
            <SignatureCTA size="small" width="fit-content" title="Get Signature" />
            
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 line-through text-lg">₹4999</span>
              <span className="text-2xl font-bold text-gray-800">₹489</span>
            </div>
            <span className="text-sm text-red-600 font-medium">Last 2 slots left only for 15min</span>
          </div>
          <SignatureCTA size="small" width="fit-content" />
        </div>
      </div>
    </div>
  );
};

export default SignatureFooter; 
