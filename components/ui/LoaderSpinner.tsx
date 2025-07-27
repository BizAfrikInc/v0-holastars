'use client';

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 rounded-xl p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Stars */}
            <div className="relative w-24 h-24">
              {/* Central Star */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 animate-pulse">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-brand"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Orbiting Stars */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 animate-spin"
                  style={{
                    animationDuration: `${2 + i * 0.5}s`,
                    animationDelay: `${i * 0.2}s`,
                    transformOrigin: '48px 48px',
                    transform: `rotate(${i * 72}deg) translateX(40px)`,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-brand-gold animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ))}
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                {message}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
