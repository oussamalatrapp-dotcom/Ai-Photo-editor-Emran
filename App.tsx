
import React, { useState, useCallback } from 'react';
import { PhotoStyle } from './types';
import { availableStyles } from './constants';
import { editImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import SparklesIcon from './components/icons/SparklesIcon';
import DownloadIcon from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>(PhotoStyle.REALISTIC);
  const [itemToMove, setItemToMove] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!backgroundImage) {
      setError('Please upload a background image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImage({
        backgroundImage,
        itemImage,
        itemToMove,
        selectedStyle,
      });
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [backgroundImage, itemImage, itemToMove, selectedStyle]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-edited-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="md:col-span-4 space-y-6">
            <ImageUploader
              title="1. Upload Background"
              id="bg-uploader"
              onImageUpload={(base64) => setBackgroundImage(base64 || null)}
            />
            <ImageUploader
              title="2. Upload Item (Optional)"
              id="item-uploader"
              onImageUpload={(base64) => setItemImage(base64 || null)}
            />
             {itemImage && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                <label htmlFor="itemToMove" className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Item to Add
                </label>
                <input
                  id="itemToMove"
                  type="text"
                  value={itemToMove}
                  onChange={(e) => setItemToMove(e.target.value)}
                  placeholder="e.g., 'the bouquet of roses'"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            )}
            <StyleSelector
              styles={availableStyles}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
            <div className="sticky bottom-4">
               <button
                  onClick={handleGenerate}
                  disabled={isLoading || !backgroundImage}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-6 h-6" />
                      Generate Image
                    </>
                  )}
                </button>
            </div>
          </div>

          {/* Result Column */}
          <div className="md:col-span-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg h-full flex flex-col items-center justify-center min-h-[600px]">
              {error && (
                <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                  <h3 className="font-bold">Error</h3>
                  <p>{error}</p>
                </div>
              )}
              {isLoading && (
                 <div className="text-center p-8">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 animate-pulse">AI is creating magic...</h3>
                    <p className="text-gray-500 dark:text-gray-400">This can take a moment. Please wait.</p>
                </div>
              )}
              {!isLoading && !generatedImage && !error && (
                <div className="text-center p-8">
                    <SparklesIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your generated image will appear here</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Upload your images, select a style, and click 'Generate'.</p>
                </div>
              )}
              {generatedImage && (
                <div className="relative w-full">
                  <img src={generatedImage} alt="Generated" className="rounded-lg w-full h-auto object-contain shadow-2xl" />
                  <button
                    onClick={handleDownload}
                    className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                    title="Download Image"
                  >
                    <DownloadIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
