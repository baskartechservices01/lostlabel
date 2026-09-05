import React, { useState } from "react";
import { getOptimizedImageUrl } from "../../services/cloudinaryService";

export default function ProductGallery({ images = [], name = "Lost Label Product" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ url: "/logo.jpg" }];
  const currentImage = displayImages[selectedIndex]?.url || "/logo.jpg";

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnail column */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[550px]">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-[#141414] border overflow-hidden transition-all duration-200 ${
                selectedIndex === index
                  ? "border-[#e8e4d9] ring-1 ring-[#e8e4d9]"
                  : "border-[#262626] opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={getOptimizedImageUrl(img.url, { width: 150 })}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main hero image */}
      <div className="flex-1 aspect-[3/4] bg-[#0e0e0e] border border-[#222] overflow-hidden relative group">
        <img
          src={getOptimizedImageUrl(currentImage, { width: 1200 })}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
        />
      </div>
    </div>
  );
}
