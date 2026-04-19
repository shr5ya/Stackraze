import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostImageCarousel({ photos = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef(null);

  // Track swipe start for mobile navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

    // Detect swipe direction (left/right) to change images
  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50 && currentImageIndex < photos.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }

    if (diff < -50 && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }

    touchStartX.current = null;
  };


   // Enable keyboard controls (ESC to close, arrows to navigate)
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return; // only work when popup is open

      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) =>
          prev < photos.length - 1 ? prev + 1 : prev
        );
      }
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, photos.length]);

  if (!photos.length) return null;

  return (
    <>

      {/* Main carousel with swipe + click-to-open fullscreen */}
      <div
        className="relative group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[currentImageIndex]}
          alt="Post"
          onClick={() => setIsOpen(true)}
          className="w-full max-h-140 lg:max-h-[500px] object-contain mx-auto bg-black cursor-zoom-in"
        />

        {/* Left Arrow */}
        {photos.length > 1 && currentImageIndex > 0 && (
          <button
            onClick={() => setCurrentImageIndex((prev) => prev - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-800 dark:text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {photos.length > 1 && currentImageIndex < photos.length - 1 && (
          <button
            onClick={() => setCurrentImageIndex((prev) => prev + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-neutral-800 dark:text-white" />
          </button>
        )}

        {/* Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{photos.length}
          </div>
        )}
      </div>

      {/* ===== Fullscreen Popup (Lightbox) ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-in fade-in"
          onClick={() => setIsOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image */}
          <img
            src={photos[currentImageIndex]}
            alt="Fullscreen"
            className="max-w-full lg:max-w-[60%] max-h-[80%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ✕
          </button>

          {/* Left Arrow */}
          {currentImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => prev - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ‹
            </button>
          )}

          {/* Right Arrow */}
          {currentImageIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => prev + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ›
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 text-white text-sm">
            {currentImageIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
