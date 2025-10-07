
import React, { useState, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (base64: string) => void;
  id: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, id }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      onImageUpload(base64);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      onImageUpload(base64);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileName('');
    onImageUpload('');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg transition-all">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg object-cover max-h-60" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <button
              onClick={handleRemoveImage}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-indigo-500">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, or WEBP</p>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
