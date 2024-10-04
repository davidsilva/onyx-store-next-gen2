"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Text,
  TextField,
  TextAreaField,
  Button,
  SelectField,
} from "@aws-amplify/ui-react";
import ImageUploader from "./ImageUploader";
import {
  Product as ProductType,
  ProductImage as ProductImageType,
} from "@/types";
import { useEffect, useState } from "react";
import { type Schema } from "@/../amplify/data/resource";

type ProductStatusType = Schema["ProductStatusType"]["type"];

type FormData = Omit<ProductType, "id" | "images" | "isArchived" | "price"> & {
  price: string;
};

type ProductFormProps = {
  product: ProductType | null;
  setProduct: React.Dispatch<React.SetStateAction<ProductType | null>>;
  images: ProductImageType[];
  setImages: React.Dispatch<React.SetStateAction<ProductImageType[]>>;
  onSubmit: SubmitHandler<FormData>;
};

const convertPriceToDollarsAndCentsString = (price: number) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "";
  }

  return (price / 100).toFixed(2).toString();
};

const ProductForm = ({
  product,
  setProduct,
  images,
  setImages,
  onSubmit,
}: ProductFormProps) => {
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
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name || "");
      setValue("description", product.description || "");
      setValue("price", convertPriceToDollarsAndCentsString(product.price));
      setValue("status", product.status as ProductStatusType);
    }
  }, [product, setValue]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        description: product.description || "",
        price: convertPriceToDollarsAndCentsString(product.price),
        mainImageS3Key: product.mainImageS3Key || "",
        status: (product.status as ProductStatusType) || "PENDING",
      });
    }
  }, [product, reset]);

  useEffect(() => {
    // If the image selected as main image is removed, reset the main image selection
    if (
      images.length > 0 &&
      !images.some((image) => image.s3Key === getValues("mainImageS3Key"))
    ) {
      setValue("mainImageS3Key", "");
    }
  }, [images, getValues, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <SelectField
            label="Status"
            {...register("status")}
            onChange={(e) => {
              const status = e.currentTarget.value as ProductStatusType;
              setProduct((prevProduct) => {
                if (prevProduct) {
                  return {
                    ...prevProduct,
                    status,
                  };
                }
                return prevProduct;
              });
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </SelectField>
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
};
export default ProductForm;
