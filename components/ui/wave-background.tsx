import React from 'react';

export const WaveBackground = () => {
  return (
    <div className="wave-background fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-400 to-cyan-300 opacity-30" />
      
      {/* Animated Waves */}
      <div className="waves-container absolute inset-0">
        <div className="wave wave1" />
        <div className="wave wave2" />
        <div className="wave wave3" />
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
};
