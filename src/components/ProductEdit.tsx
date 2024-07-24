"use client";

import { useForm } from "react-hook-form";
import { generateClient } from "@aws-amplify/api";
import {
  Card,
  Alert,
  Text,
  TextField,
  TextAreaField,
  Button,
} from "@aws-amplify/ui-react";
import { useState, useEffect, useRef } from "react";
import { type Schema } from "@/../amplify/data/resource";
import ImageUploader from "./ImageUploader";
import clearCachesByServerAction from "@/actions/revalidate";
// We might use this for comparing the current images with the original images.
import _ from "lodash";

type FormData = {
  name: string;
  description: string;
  price: string;
};

type Image = {
  id?: string;
  key: string;
  alt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  productId?: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
};

type Message = {
  type: "error" | "success";
  content: string;
};

const client = generateClient<Schema>({
  authMode: "userPool",
});

interface ProductUpdateProps {
  id: string;
}

const convertPriceToDollarsAndCentsString = (price: number) =>
  (price / 100).toFixed(2).toString();

const convertPriceToCentsInteger = (price: string) => {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Price must be a number.");
  }
  return Math.round(parsedPrice * 100);
};

const ProductUpdate = ({ id }: ProductUpdateProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  // We might use originalImagesRef to compare the current images with the original images. We could use lodash's isEqual function to compare the two objects -- and then call .update() only if the image and alt text value have changed.
  const originalImagesRef = useRef<Image[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await client.models.Product.get(
          { id },
          { selectionSet: ["id", "name", "description", "price", "images.*"] }
        );
        console.log("result", result);
        if (result.data) {
          setProduct(result.data);
          if (result.data.images.length > 0) {
            setImages(result.data.images);
            originalImagesRef.current = result.data.images;
            console.log("result.data.images", result.data.images);
          }
          reset({
            name: result.data.name,
            description: result.data.description,
            price: convertPriceToDollarsAndCentsString(result.data.price),
          });
        }
      } catch (error) {
        console.error("Could not fetch product", error);
        setMessage({
          type: "error",
          content: "Could not fetch product.",
        });
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    // Only called if form validation passes, i.e., formState.isValid is true
    // Among possible improvements: check if the form data is different from the original data before submitting the update. So, we could use the isDirty property from the formState object. Though... right now react-hook-form isn't used with the images form.
    console.log("form data", data);
    try {
      const result = await client.models.Product.update({
        id,
        name: data.name,
        description: data.description,
        price: convertPriceToCentsInteger(data.price),
      });

      console.log("result", result);

      const productId = result.data?.id;

      console.log("onSubmit images", images);

      if (productId) {
        for (const image of images) {
          /*           
          At least 2 possible approaches to updating images in db:

          (1) Check which images are new, which have been updated (the alt text has been changed), and which have been removed -- and then call ProductImage.create(), ProductImage.update() and ProductImage.delete() as appropriate.
          
          (2) Delete all the image db records associated with the product and then create all the images again using the images state variable.

          How could we make this more efficient? Bear in mind that we're dealing with just a handful of images (just 5). Right now, we're calling .update() even if the image and alt text value haven't changed. Could we use originalImagesRef.current to compare the current image with the original image? Could we use lodash's isEqual function to compare the two objects?
          Could the create and update calls be batched?

          Update image. Image has an id only if it has been created in the database, i.e., in a previous creation or edit. It won't have an id if it has only just been uploaded to S3.

 */ if (image.id) {
            console.log("update image", image);
            await client.models.ProductImage.update({
              id: image.id,
              key: image.key,
              alt: image.alt,
              productId,
            });
          } else {
            // Create image
            console.log("create image", image);
            const { data } = await client.models.ProductImage.create({
              key: image.key,
              alt: image.alt,
              productId,
            });
            console.log("create image data", data);
            if (data) {
              setImages((prevImages) =>
                prevImages.map((img) =>
                  img.key === image.key && img.alt === image.alt
                    ? { ...img, id: data.id }
                    : img
                )
              );
            }
          }
        }

        // Delete images that have been removed.
        const imagesToDelete = originalImagesRef.current.filter(
          (originalImage) =>
            !images.some((image) => image.key === originalImage.key)
        );

        imagesToDelete.forEach(async (image) => {
          console.log("delete image", image);
          if (image.id) {
            await client.models.ProductImage.delete({ id: image.id });
          }
        });

        const checkProduct = await client.models.Product.get(
          { id: productId },
          { selectionSet: ["id", "name", "description", "price", "images.*"] }
        );
        console.log("checkProduct", checkProduct);

        clearCachesByServerAction();
        clearCachesByServerAction(`/admin/product-edit/${id}`);
        setMessage({
          type: "success",
          content: "The update was saved successfully.",
        });
      }
    } catch (error) {
      console.error("error", error);
      setMessage({
        type: "error",
        content: "An error occurred when trying to save changes.",
      });
    }
  });

  return (
    <Card>
      {message ? (
        <Alert variation={message.type}>{message.content}</Alert>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Update Product
          </h1>
          <form onSubmit={onSubmit}>
            <div>
              <TextField
                label="Name"
                hasError={!!errors.name}
                errorMessage={errors.name?.message}
                {...register("name", { required: "A name is required." })}
              />
            </div>
            <div>
              <TextAreaField
                label="Description"
                hasError={!!errors.description}
                errorMessage={errors.description?.message}
                {...register("description", {
                  required: "A description is required.",
                })}
              />
            </div>
            <div>
              <TextField
                type="text"
                label="Price"
                hasError={!!errors.price}
                errorMessage={errors.price?.message}
                {...register("price", {
                  required: "A price is required.",
                  pattern: {
                    value: /^\d+(\.\d{0,2})?$/,
                    message:
                      "Price must be a number with up to two decimal places.",
                  },
                })}
              />
            </div>
            <div>
              <Text fontWeight={600}>Images</Text>
              <ImageUploader setImages={setImages} images={images} />
            </div>
            <div>
              <Button type="submit">Update Product</Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
export default ProductUpdate;
