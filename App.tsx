
import React, { useState, useCallback, useMemo } from 'react';
import { convertImage } from './services/geminiService';
// Fix: The ArtStyle type is exported from `./types`, not `./constants`.
import { artStyles } from './constants';
import { ArtStyle } from './types';
import { UploadIcon, SparklesIcon, XCircleIcon } from './components/Icons';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(artStyles[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size exceeds 4MB. Please choose a smaller file.");
        return;
      }
      setError(null);
      setOriginalImage(file);
      setGeneratedImageUrl(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleConversion = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    try {
      const base64Image = await convertImage(originalImage, selectedStyle.prompt);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during conversion.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle]);

  const canConvert = useMemo(() => originalImage && !isLoading, [originalImage, isLoading]);

  const resetState = () => {
    setOriginalImage(null);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
    setIsLoading(false);
    setError(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Artify AI
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Transform your photos into stunning artworks with Gemini.
        </p>
      </header>
      
      <main className="w-full max-w-6xl flex-grow">
        <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700">
          
          {!originalImage ? (
            <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-600 rounded-lg text-center p-4">
              <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-200">Upload Your Photo</h2>
              <p className="text-gray-400 mt-1">Drag & drop or click to select a file (PNG, JPG, WEBP).</p>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg cursor-pointer transition-transform transform hover:scale-105">
                Select Image
              </label>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageCard title="Original" imageUrl={originalImageUrl} onClear={resetState} />
                <ImageCard title="Artified" imageUrl={generatedImageUrl} isLoading={isLoading} />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Select an Artistic Style</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {artStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        selectedStyle.id === style.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleConversion}
                  disabled={!canConvert}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                >
                  <SparklesIcon className="w-6 h-6" />
                  <span>Artify Now</span>
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="mt-6 flex items-center justify-center bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-3 text-sm">
              <XCircleIcon className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-6xl text-center mt-8 py-4">
        <p className="text-gray-500 text-sm">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

interface ImageCardProps {
    title: string;
    imageUrl: string | null;
    isLoading?: boolean;
    onClear?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, isLoading = false, onClear }) => (
    <div className="relative aspect-square bg-gray-900/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
        {onClear && (
            <button
                onClick={onClear}
                className="absolute top-2 right-2 z-10 p-1.5 bg-gray-800/70 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                aria-label="Clear image"
            >
                <XCircleIcon className="w-5 h-5" />
            </button>
        )}
        <div className="w-full h-full flex items-center justify-center">
        {isLoading ? (
            <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <p className="mt-3 text-sm font-medium">Creating your masterpiece...</p>
            </div>
        ) : imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
            <div className="text-center text-gray-500 p-4">
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="text-sm">Your image will appear here</p>
            </div>
        )}
        </div>
    </div>
);


export default App;