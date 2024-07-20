"use client";

import { TextField, Card, Grid, Button } from "@aws-amplify/ui-react";
import { StorageImage, StorageManager } from "@aws-amplify/ui-react-storage";

type Image = {
  key: string;
  alt?: string;
};

interface ImageUploaderProps {
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  images: Image[];
  maxImages?: number;
}

const ImageUploader = ({
  setImages,
  images,
  maxImages = 5,
}: ImageUploaderProps) => {
  const handleAltChange = (key: string, value: string) => {
    // If user uploads the same image multiple times, the alt text will be the same for all images with the same key. Is that a problem? User shouldn't add the same image multiple times. And if they do, why shouldn't the alt text be the same?
    console.log("handleAltChange", key, value);
    setImages((prevImages: Image[]) =>
      prevImages.map((image) =>
        image.key === key ? { ...image, alt: value } : image
      )
    );
  };

  const handleRemoveImage = (key: string) => {
    // All images with the same key will be removed. Is that a problem?
    console.log("handleRemoveImage", key);
    setImages((prevImages: Image[]) =>
      prevImages.filter((image) => image.key !== key)
    );
  };

  const uploadedImages = images.map((image, idx) => (
    <Card key={idx} variation="outlined">
      <StorageImage path={image.key} alt={image.alt ? image.alt : image.key} />
      {image.key && (
        <div>
          <TextField
            type="text"
            label="Alt"
            onChange={(e) => handleAltChange(image.key, e.currentTarget.value)}
            value={image.alt ? image.alt : ""}
          />
          <Button onClick={(e) => handleRemoveImage(image.key)}>Remove</Button>
        </div>
      )}
    </Card>
  ));

  return (
    <div>
      <Grid templateColumns="1fr 1fr 1fr 1fr 1fr" columnGap="0.5rem">
        {uploadedImages}
      </Grid>
      <div>
        {images.length < maxImages && (
          <StorageManager
            acceptedFileTypes={["image/*"]}
            maxFileCount={maxImages - images.length}
            path="product-images/"
            onUploadSuccess={({ key }) => {
              if (key) {
                setImages((prevImages: Image[]) => [
                  ...prevImages,
                  { key: key, alt: key },
                ]);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
export default ImageUploader;
