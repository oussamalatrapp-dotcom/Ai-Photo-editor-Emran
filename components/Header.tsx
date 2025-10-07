
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center gap-3 mb-2">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          AI Photo Editor
        </h1>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Combine images, replace objects, and apply stunning styles with the power of Gemini.
      </p>
    </header>
  );
};

export default Header;
