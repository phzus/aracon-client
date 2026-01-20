import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  title: string;
}

export function ImageGallery({ images, mainImage, title }: ImageGalleryProps) {
  const allImages = [mainImage, ...(images || [])].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentImage = allImages[selectedIndex] || mainImage;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  if (allImages.length === 0) {
    return (
      <div className="ma:aspect-[16/9] ma:bg-gray-100 ma:rounded-2xl ma:flex ma:items-center ma:justify-center">
        <span className="ma:text-gray-400">Sem imagens disponíveis</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="ma:space-y-4 ">
        {/* Main Image */}
        <div className="ma:relative ma:overflow-hidden ma:rounded-lg ma:bg-gray-100 gallery-main-image">
          <img
            src={currentImage}
            alt={`${title} - Imagem ${selectedIndex + 1}`}
            className="ma:w-full ma:h-full ma:object-cover"
          />

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="ma:absolute ma:left-4 ma:top-1/2 ma--translate-y-1/2 ma:w-10 ma:h-10 ma:bg-white/80 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-gray-700 hover:ma:bg-white ma:transition-colors ma:shadow-lg"
                aria-label="Imagem anterior"
              >
                <svg className="ma:w-5 ma:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="ma:absolute ma:right-4 ma:top-1/2 ma--translate-y-1/2 ma:w-10 ma:h-10 ma:bg-white/80 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-gray-700 hover:ma:bg-white ma:transition-colors ma:shadow-lg"
                aria-label="Próxima imagem"
              >
                <svg className="ma:w-5 ma:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="ma:absolute ma:top-4 ma:right-4 ma:w-10 ma:h-10 ma:bg-white/80 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-gray-700 hover:ma:bg-white ma:transition-colors ma:shadow-lg"
            aria-label="Ver em tela cheia"
          >
            <svg className="ma:w-5 ma:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="ma:absolute ma:bottom-4 ma:left-1/2 ma--translate-x-1/2 ma:px-3 ma:py-1 ma:bg-black/60 ma-backdrop-blur-sm ma:rounded-full ma:text-white ma:text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="ma:overflow-x-auto gallery-scroll ma:pb-2">
            <div className="ma:flex ma:gap-2 ma:min-w-max">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`ma:flex-shrink-0 ma:w-20 ma:h-20 ma:rounded-lg ma:overflow-hidden ma:border-2 ma:transition-all ${
                    index === selectedIndex
                      ? 'ma:border-blue-600 ma:ring-2 ma:ring-blue-200'
                      : 'ma:border-transparent hover:ma:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="ma:w-full ma:h-full ma:object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="ma:fixed ma:inset-0 ma:z-50 ma:bg-black ma:flex ma:items-center ma:justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="ma:absolute ma:top-4 ma:right-4 ma:z-10 ma:w-12 ma:h-12 ma:bg-white/20 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-white hover:ma:bg-white/30 ma:transition-colors"
            aria-label="Fechar"
          >
            <svg className="ma:w-6 ma:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="ma:absolute ma:left-4 ma:top-1/2 ma--translate-y-1/2 ma:w-12 ma:h-12 ma:bg-white/20 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-white hover:ma:bg-white/30 ma:transition-colors"
              >
                <svg className="ma:w-6 ma:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="ma:absolute ma:right-4 ma:top-1/2 ma--translate-y-1/2 ma:w-12 ma:h-12 ma:bg-white/20 ma-backdrop-blur-sm ma:rounded-full ma:flex ma:items-center ma:justify-center ma:text-white hover:ma:bg-white/30 ma:transition-colors"
              >
                <svg className="ma:w-6 ma:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen Image */}
          <img
            src={currentImage}
            alt={`${title} - Imagem ${selectedIndex + 1}`}
            className="ma:max-w-full ma:max-h-full ma:object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="ma:absolute ma:bottom-4 ma:left-1/2 ma--translate-x-1/2 ma:px-4 ma:py-2 ma:bg-black/60 ma-backdrop-blur-sm ma:rounded-full ma:text-white">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
