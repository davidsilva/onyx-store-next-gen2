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
  SelectField,
} from "@aws-amplify/ui-react";
import { useState, useEffect, useRef } from "react";
import { type Schema } from "@/../amplify/data/resource";
import ImageUploader from "./ImageUploader";
import clearCachesByServerAction from "@/actions/revalidate";

type Nullable<T> = T | null;

type FormData = {
  name: string;
  description: string;
  price: string;
  mainImageS3Key: string;
};

type Image = {
  id?: string;
  s3Key: Nullable<string>;
  alt: Nullable<string>;
  createdAt?: string;
  updatedAt?: string;
  productId?: Nullable<string>;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
  mainImageS3Key: Nullable<string>;
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
  const [product, setProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      mainImageS3Key: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await client.models.Product.get(
          { id },
          {
            selectionSet: [
              "id",
              "name",
              "description",
              "price",
              "mainImageS3Key",
              "images.*",
            ],
          }
        );
        console.log("result", result);
        if (result.data) {
          setProduct(result.data);
          if (result.data.images.length > 0) {
            setImages(result.data.images);
            console.log("result.data.images", result.data.images);
          }
          reset({
            name: result.data.name,
            description: result.data.description,
            price: convertPriceToDollarsAndCentsString(result.data.price),
            mainImageS3Key: result.data.mainImageS3Key || "",
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

  useEffect(() => {
    // If the image selected as main image is removed, reset the main image selection
    if (
      images.length > 0 &&
      !images.some((image) => image.s3Key === getValues("mainImageS3Key"))
    ) {
      console.log("resetting main image");
      setValue("mainImageS3Key", "");
    }
  }, [images]);

  const onSubmit = handleSubmit(async (data) => {
    // Only called if form validation passes, i.e., formState.isValid is true
    // Among possible improvements: check if the form data is different from the original data before submitting the update. We could maybe use the isDirty property from the formState object.
    console.log("form data", data);
    try {
      // Rather than figure out which images are new, updated or removed, we'll just delete all the images associated with the product and then create them all again.
      const relatedImagesResult =
        await client.models.ProductImage.listProductImageByProductId({
          productId: id,
        });
      console.log("relatedImagesResult", relatedImagesResult);

      // Turn relatedImagesResult into an array of image ids. data is an array of objects, each with an id property.
      const relatedImageIds = relatedImagesResult.data.map((image) => image.id);

      // Delete all images associated with the product.
      for (const id of relatedImageIds) {
        const deleteResult = await client.models.ProductImage.delete({ id });
        console.log("image deleteResult", deleteResult);
      }

      images.forEach(async (image) => {
        await client.models.ProductImage.create({
          s3Key: image.s3Key,
          alt: image.alt,
          productId: id,
        });
      });

      const result = await client.models.Product.update({
        id,
        name: data.name,
        description: data.description,
        price: convertPriceToCentsInteger(data.price),
      });

      console.log("product update result", result);
      clearCachesByServerAction();
      clearCachesByServerAction(`/admin/product-edit/${id}`);

      setMessage({
        type: "success",
        content: "The update was saved successfully.",
      });
    } catch (error) {
      console.error("error", error);
      setMessage({
        type: "error",
        content: "An error occurred when trying to save changes.",
      });
    }
  });

  if (!product) {
    return (
      <Card>
        <Text>No products...</Text>
      </Card>
    );
  }

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
              <div>
                <SelectField
                  label="Main Image"
                  {...register("mainImageS3Key")}
                  onChange={(e) => {
                    const mainImageS3Key = e.currentTarget.value;
                    setProduct((prevProduct) => {
                      if (prevProduct) {
                        return {
                          ...prevProduct,
                          mainImageS3Key,
                        };
                      }
                      return prevProduct;
                    });
                  }}
                >
                  {images.map((image, idx) => (
                    <option key={idx} value={image.s3Key ?? ""}>
                      {image.s3Key ?? "No S3 Key"}
                    </option>
                  ))}
                </SelectField>
              </div>
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
