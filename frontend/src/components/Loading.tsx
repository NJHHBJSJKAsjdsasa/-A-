import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
}

const Loading: React.FC<LoadingProps> = ({
  message = '加载中...',
  fullScreen = false,
  size = 'medium',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center';

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} border-4 border-doraemon-blue border-t-transparent rounded-full animate-rotate`}></div>
        );
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : 'w-4 h-4'} bg-doraemon-blue rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-doraemon-blue rounded-full animate-pulse`}></div>
        );
      default:
        return (
          <div className={`${sizeClasses[size]} border-4 border-doraemon-blue border-t-transparent rounded-full animate-rotate`}></div>
        );
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        {renderLoader()}
        {message && (
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;