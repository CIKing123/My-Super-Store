import React, { useEffect, useRef } from 'react';

export const LottieParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    let script = document.querySelector('script[src*="lottie"]') as HTMLScriptElement | null;
    
    const initLottie = () => {
      if (!window.lottie || !containerRef.current) return;
      
      lottieRef.current = window.lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Particle wave with depth.lottie',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      });

      // Reduce opacity for background effect
      if (containerRef.current) {
        containerRef.current.style.opacity = '0.6';
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
      script.async = true;
      script.onload = initLottie;
      document.body.appendChild(script);
    } else {
      initLottie();
    }

    return () => {
      if (lottieRef.current) {
        lottieRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="lottie-particles"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

declare global {
  interface Window {
    lottie: any;
  }
}

export default LottieParticles;
