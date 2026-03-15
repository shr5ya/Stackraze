{
  photos.length > 0 && (
    <div className="relative group">
      <img
        src={photos[currentImageIndex]}
        alt="Post"
        className="w-full aspect-video object-contain bg-black"
        onError={() => setImageError(true)}
      />

      {/* Left Arrow Button */}
      {photos.length > 1 && currentImageIndex > 0 && (
        <button
          onClick={() => setCurrentImageIndex((prev) => prev - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/90 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-800 dark:text-white" />
        </button>
      )}

      {/* Right Arrow Button */}
      {photos.length > 1 && currentImageIndex < photos.length - 1 && (
        <button
          onClick={() => setCurrentImageIndex((prev) => prev + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-black/70 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/90 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-neutral-800 dark:text-white" />
        </button>
      )}

      {/* Image Navigation Dots */}
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

      {/* Image Counter */}
      {photos.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{photos.length}
        </div>
      )}
    </div>
  );
}
