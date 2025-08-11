import React, { useState, useEffect } from 'react';

const ScrollGradient = ({ children, className = '' }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate dynamic gradient based on scroll and mouse position
  const getDynamicGradient = () => {
    const progress = Math.min(scrollY / 1500, 1); // Normalize scroll to 0-1
    const mouseX = (mousePosition.x / window.innerWidth) * 100;
    const mouseY = (mousePosition.y / window.innerHeight) * 100;
    
    // Create a more sophisticated gradient system
    const baseHue = 220 + (progress * 40); // Shift from blue to cyan
    const saturation = 30 + (progress * 20); // Increase saturation with scroll
    const lightness = 15 + (progress * 10); // Subtle lightness change
    
    // Mouse-influenced accent color
    const accentOpacity = 0.1 + (progress * 0.2);
    
    return {
      background: `
        radial-gradient(
          circle at ${mouseX}% ${mouseY}%, 
          hsla(${baseHue + 20}, ${saturation + 30}%, ${lightness + 15}%, ${accentOpacity}) 0%, 
          transparent 50%
        ),
        linear-gradient(
          135deg, 
          hsl(${baseHue}, ${saturation}%, ${lightness}%) 0%, 
          hsl(${baseHue + 10}, ${saturation + 5}%, ${lightness + 5}%) 35%,
          hsl(${baseHue - 10}, ${saturation}%, ${lightness + 3}%) 65%,
          hsl(${baseHue + 5}, ${saturation - 5}%, ${lightness}%) 100%
        )
      `,
      borderImage: `linear-gradient(90deg, 
        transparent 0%, 
        hsla(${baseHue + 40}, 60%, 60%, 0.3) 20%, 
        hsla(${baseHue + 40}, 60%, 60%, 0.6) 50%, 
        hsla(${baseHue + 40}, 60%, 60%, 0.3) 80%, 
        transparent 100%
      ) 1`,
      boxShadow: `
        0 0 20px hsla(${baseHue + 40}, 60%, 60%, ${0.1 + progress * 0.2}),
        inset 0 1px 0 hsla(0, 0%, 100%, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1)
      `
    };
  };
  
  const dynamicStyles = getDynamicGradient();
  
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl border-2 border-transparent
        transition-all duration-700 ease-out hover:scale-[1.01]
        ${className}
      `}
      style={{
        background: dynamicStyles.background,
        borderImage: dynamicStyles.borderImage,
        boxShadow: dynamicStyles.boxShadow
      }}
    >
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute w-1 h-1 bg-accent-400 rounded-full animate-float"
          style={{
            left: '20%',
            top: '30%',
            animationDelay: '0s',
            animationDuration: '3s'
          }}
        />
        <div 
          className="absolute w-1 h-1 bg-electric-400 rounded-full animate-float"
          style={{
            left: '70%',
            top: '60%',
            animationDelay: '1s',
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute w-0.5 h-0.5 bg-accent-300 rounded-full animate-float"
          style={{
            left: '80%',
            top: '20%',
            animationDelay: '2s',
            animationDuration: '5s'
          }}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl">
        {children}
      </div>
    </div>
  );
};

export default ScrollGradient;
