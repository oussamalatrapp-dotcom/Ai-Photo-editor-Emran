
import React from 'react';
import { PhotoStyle } from '../types';

interface StyleSelectorProps {
  styles: PhotoStyle[];
  selectedStyle: PhotoStyle;
  onStyleChange: (style: PhotoStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onStyleChange }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg transition-all">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">3. Choose a Style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500
              ${
                selectedStyle === style
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
