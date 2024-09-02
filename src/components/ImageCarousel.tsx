"use client";

import { useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import { type ProductImage } from "@/types";

type ImageCarouselProps = {
  images: ProductImage[];
  className?: string;
};

const ImageCarousel = ({ images, className }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className || ""}`}
    >
      <button
        onClick={handlePrevious}
        className="bg-transparent text-4xl cursor-pointer absolute left-0"
      >
        &lt;
      </button>
      {images[currentIndex].s3Key && (
        <StorageImage
          path={images[currentIndex].s3Key}
          alt={images[currentIndex].alt || "Product image"}
        />
      )}
      <button
        onClick={handleNext}
        className="bg-transparent text-4xl cursor-pointer absolute right-0"
      >
        &gt;
      </button>
    </div>
  );
};
export default ImageCarousel;
