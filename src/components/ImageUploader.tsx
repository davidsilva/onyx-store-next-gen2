"use client";

import { TextField, Card, Grid, Button } from "@aws-amplify/ui-react";
import { StorageImage, StorageManager } from "@aws-amplify/ui-react-storage";
import _ from "lodash";
import { useCallback, useState } from "react";

type Image = {
  id?: string;
  key: string;
  alt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  productId?: string | null;
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
  const [localAlts, setLocalAlts] = useState<{ [key: string]: string }>({});

  const handleAltChange = (key: string, value: string) => {
    // If user uploads the same image multiple times, the alt text will be the same for all images with the same key. Is that a problem? User shouldn't add the same image multiple times. And if they do, why shouldn't the alt text be the same?
    console.log("handleAltChange", key, value);
    setLocalAlts((prevAlts) => ({ ...prevAlts, [key]: value }));
    debouncedUpdateAlt(key, value);
  };

  const debouncedUpdateAlt = useCallback(
    _.debounce((key: string, value: string) => {
      setImages((prevImages: Image[]) =>
        prevImages.map((image, idx) =>
          `${image.key}-${idx}` === key ? { ...image, alt: value } : image
        )
      );
    }, 1000),
    []
  );

  const handleRemoveImage = (uniqueKey: string) => {
    // All images with the same key will be removed. Is that a problem?
    console.log("handleRemoveImage", uniqueKey);
    setImages((prevImages: Image[]) =>
      prevImages.filter((image, idx) => `${image.key}-${idx}` !== uniqueKey)
    );
    setLocalAlts((prevAlts) => {
      const newAlts = { ...prevAlts };
      delete newAlts[uniqueKey];
      return newAlts;
    });
  };

  const uploadedImages = images.map((image, idx) => {
    const uniqueKey = `${image.key}-${idx}`;
    return (
      <Card key={uniqueKey} variation="outlined">
        <StorageImage
          path={image.key}
          alt={image.alt ? image.alt : image.key}
        />
        {image.key && (
          <div>
            <TextField
              type="text"
              label="Alt"
              onChange={(e) =>
                handleAltChange(uniqueKey, e.currentTarget.value)
              }
              value={localAlts[uniqueKey] ?? image.alt ?? ""}
            />
            <Button onClick={(e) => handleRemoveImage(uniqueKey)}>
              Remove
            </Button>
          </div>
        )}
      </Card>
    );
  });

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
            components={{ FileList: () => null }}
            onUploadSuccess={({ key }) => {
              if (key) {
                setImages((prevImages: Image[]) => [
                  ...prevImages,
                  { key: key, alt: key },
                ]);
              }
            }}
            onUploadError={(error) => console.error("error", error)}
          />
        )}
      </div>
    </div>
  );
};
export default ImageUploader;
