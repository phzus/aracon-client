import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface SyncedGalleryProps {
  images: string[];
  title: string;
}

export default function SyncedGallery({ images, title }: SyncedGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Main carousel (big image)
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });

  // Thumbnail carousel
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  // Sync main carousel with thumbnails
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  // Update selected index when main carousel changes
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
    return () => {
      mainApi.off('select', onSelect);
      mainApi.off('reInit', onSelect);
    };
  }, [mainApi, onSelect]);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (mainApi) mainApi.scrollPrev();
  }, [mainApi]);

  const scrollNext = useCallback(() => {
    if (mainApi) mainApi.scrollNext();
  }, [mainApi]);

  if (!images || images.length === 0) {
    return (
      <div className="ma:aspect-square lg:ma:aspect-[16/10] ma:bg-gray-100 ma:rounded-none lg:ma:rounded-lg ma:flex ma:items-center ma:justify-center">
        <span className="ma:text-gray-400">Sem imagens disponíveis</span>
      </div>
    );
  }

  return (
    <div className="ma:space-y-4 ma:pb-0 lg:ma:pb-10">
      {/* Main Carousel */}
      <div className="ma:relative">
        <div className="ma:overflow-hidden ma:rounded-none lg:ma:rounded-lg" ref={mainRef}>
          <div className="ma:flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="ma:flex-[0_0_100%] ma:min-w-0"
              >
                <div className="ma:aspect-square lg:ma:aspect-[16/10] ma:bg-gray-100">
                  <img
                    src={image}
                    alt={`${title} - Imagem ${index + 1}`}
                    className="ma:w-full ma:h-full ma:object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Minimalista */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="ma:absolute ma:left-4 ma:top-1/2 ma:-translate-y-1/2 ma:p-2 ma:cursor-pointer ma:transition-opacity hover:ma:opacity-80"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <svg className="ma:w-8 ma:h-8 ma:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="ma:absolute ma:right-4 ma:top-1/2 ma:-translate-y-1/2 ma:p-2 ma:cursor-pointer ma:transition-opacity hover:ma:opacity-80"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <svg className="ma:w-8 ma:h-8 ma:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="ma:overflow-hidden ma:px-5 lg:ma:px-0" ref={thumbRef}>
          <div className="ma:flex ma:gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`ma:flex-shrink-0 ma:w-20 ma:h-16 ma:rounded-lg ma:overflow-hidden ma:border-2 ma:transition-all ma:cursor-pointer ${
                  index === selectedIndex
                    ? 'ma:border-blue-500 ma:ring-2 ma:ring-blue-200'
                    : 'ma:border-transparent ma:opacity-60 hover:ma:opacity-100 hover:ma:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${title} - Miniatura ${index + 1}`}
                  className="ma:w-full ma:h-full ma:object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
