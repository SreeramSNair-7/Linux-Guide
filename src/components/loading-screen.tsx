'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
        <Image
          src="/image.png"
          alt="Loading"
          width={120}
          height={120}
          className="h-24 w-24 sm:h-32 sm:w-32 animate-pulse"
        />
        <div className="flex gap-2">
          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
