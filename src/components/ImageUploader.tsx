"use client";

import { Text, TextField, Card, Grid, Button } from "@aws-amplify/ui-react";
import { StorageImage, StorageManager } from "@aws-amplify/ui-react-storage";
import _ from "lodash";
import { useCallback, useState, useEffect } from "react";

type Image = {
  id?: string;
  s3Key: string;
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
  // We're defaulting to maximum 5 images but not enforcing it -- yet. There should be *some* maximum.
  maxImages = 5,
}: ImageUploaderProps) => {
  const [localAlts, setLocalAlts] = useState<{ [s3Key: string]: string }>({});

  useEffect(() => {
    setLocalAlts((prevAlts) => {
      const newAlts = { ...prevAlts };
      Object.keys(newAlts).forEach((key) => {
        if (!images.some((image) => image.s3Key === key)) {
          delete newAlts[key];
        }
      });
      return newAlts;
    });
  }, [images]);

  const debouncedUpdateAlt = _.debounce((s3Key: string, value: string) => {
    setImages((prevImages: Image[]) =>
      prevImages.map((image) =>
        image.s3Key === s3Key ? { ...image, alt: value } : image
      )
    );
  }, 1000);

  const handleAltChange = useCallback(
    (s3Key: string, value: string) => {
      setLocalAlts((prevAlts) => ({ ...prevAlts, [s3Key]: value }));
      debouncedUpdateAlt(s3Key, value);
    },
    [debouncedUpdateAlt]
  );

  const handleRemoveImage = (s3Key: string) => {
    console.log("handleRemoveImage", s3Key);
    setImages((prevImages: Image[]) =>
      prevImages.filter((image, idx) => image.s3Key !== s3Key)
    );
  };

  // If user uploads an image with same name as an existing image, it will have the same s3Key. Presumably it can just replace the existing image.
  const uploadedImages = images.map((image, idx) => {
    return (
      <Card key={`${image.s3Key}-${idx}`} variation="outlined">
        <div>
          <Text>{image.s3Key}</Text>
          <StorageImage path={image.s3Key} alt={image.alt ? image.alt : ""} />
        </div>
        {image.s3Key && (
          <div>
            <TextField
              type="text"
              label="Alt"
              onChange={(e) =>
                handleAltChange(image.s3Key, e.currentTarget.value)
              }
              value={localAlts[image.s3Key] ?? image.alt ?? ""}
            />
            <Button onClick={(e) => handleRemoveImage(image.s3Key)}>
              Remove
            </Button>
          </div>
        )}
      </Card>
    );
  });

  return (
    <div>
      {/* We need to make the grid columns match the variable maxImages. */}
      <Grid templateColumns="1fr 1fr 1fr 1fr 1fr" columnGap="0.5rem">
        {uploadedImages}
      </Grid>
      <div>
        <StorageManager
          acceptedFileTypes={["image/*"]}
          maxFileCount={5}
          path="product-images/"
          // components={{
          //   FileList: ({ files, onCancelUpload, onDeleteUpload }) => null,
          // }}
          onUploadSuccess={(result) => {
            console.log("onUploadSuccess result", result);
            const s3Key = result.key;
            if (s3Key) {
              setImages((prevImages: Image[]) => {
                const imageExists = prevImages.some(
                  (image) => image.s3Key === s3Key
                );
                if (imageExists) {
                  return prevImages.map((image) =>
                    image.s3Key === s3Key ? { s3Key: s3Key, alt: "" } : image
                  );
                } else {
                  return [...prevImages, { s3Key: s3Key, alt: "" }];
                }
              });
            }
          }}
          onUploadError={(error) => console.error("error", error)}
          onFileRemove={({ key }) => {
            console.log("onFileRemove in StorageManager key", key);
            const s3Key = `product-images/${key}`;
            if (s3Key) {
              setImages((prevImages: Image[]) =>
                prevImages.filter((image) => image.s3Key !== s3Key)
              );
            }
          }}
        />
      </div>
    </div>
  );
};
export default ImageUploader;
