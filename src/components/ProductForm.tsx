"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Text,
  TextField,
  TextAreaField,
  Button,
  SelectField,
  CheckboxField,
} from "@aws-amplify/ui-react";
import ImageUploader from "./ImageUploader";
import { Product, Image } from "@/types";
import { useEffect, useState } from "react";

type FormData = Omit<Product, "id" | "images" | "isArchived" | "price"> & {
  price: string;
};

type ProductFormProps = {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
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
  // Manage the isActive checkbox state independently within the ProductForm component, avoiding conflicts between the checked attribute and the onChange handler
  const [isActive, setIsActive] = useState(product?.isActive ?? false);

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
    setIsActive(product?.isActive ?? false);
  }, [product]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        description: product.description || "",
        price: convertPriceToDollarsAndCentsString(product.price),
        mainImageS3Key: product.mainImageS3Key || "",
        isActive: product.isActive || false,
      });
    }
  }, [product, reset]);

  useEffect(() => {
    // If the image selected as main image is removed, reset the main image selection
    if (
      images.length > 0 &&
      !images.some((image) => image.s3Key === getValues("mainImageS3Key"))
    ) {
      console.log("resetting main image");
      setValue("mainImageS3Key", "");
    }
  }, [images, getValues, setValue]);

  console.log("product?.isActive:", product?.isActive);

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
          <CheckboxField
            {...register("isActive")}
            checked={isActive}
            label="Is Active"
            onChange={(e) => {
              const newIsActive = e.currentTarget.checked;
              setIsActive(newIsActive);
              setProduct((prevProduct) => {
                if (prevProduct) {
                  return {
                    ...prevProduct,
                    isActive: newIsActive,
                  };
                }
                return prevProduct;
              });
            }}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
};
export default ProductForm;
