"use client";

/* 
- The createImage mutation has to be called to persist the image in the database. It needs the product ID and the image key. The product ID won't be available until the product is created, so the image record creation has to be done after the product creation.
- The user is able to enter information and upload or remove images in any order.
- The user can add multiple images.
- The images will stay in the S3 bucket even if the product is deleted.
- We could have a script that runs periodically to delete images that are not associated with any product.
*/
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
import { useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import ImageUploader from "./ImageUploader";
import clearCachesByServerAction from "@/actions/revalidate";

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

type Message = {
  type: "error" | "success";
  content: string;
};

const client = generateClient<Schema>({
  authMode: "userPool",
});

const convertPriceToCentsInteger = (price: string) => {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Price must be a number.");
  }
  return Math.round(parsedPrice * 100);
};

const ProductCreate = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Only called if form validation passes.
    console.log("form data", data);

    try {
      const result = await client.models.Product.create({
        name: data.name,
        description: data.description,
        price: convertPriceToCentsInteger(data.price), // convert to cents
      });

      console.log("result", result);

      const productId = result.data?.id;

      if (productId) {
        for (const image of images) {
          await client.models.ProductImage.create({
            key: image.key,
            alt: image.alt,
            productId,
          });
        }

        const checkProduct = await client.models.Product.get(
          { id: productId },
          { selectionSet: ["id", "name", "description", "price", "images.*"] }
        );
        console.log("checkProduct", checkProduct);
        setMessage({
          type: "success",
          content: "Product created successfully.",
        });

        clearCachesByServerAction();
      }
    } catch (error) {
      console.error("error", error);
      setMessage({
        type: "error",
        content: "An error occurred. Please try again.",
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
            Create Product
          </h1>
          <form onSubmit={onSubmit}>
            <div>
              <TextField
                label={<Text fontWeight={600}>Name</Text>}
                hasError={!!formState.errors.name}
                errorMessage={formState.errors.name?.message}
                {...register("name", { required: "A name is required." })}
              />
            </div>
            <div>
              <TextAreaField
                label={<Text fontWeight={600}>Description</Text>}
                hasError={!!formState.errors.description}
                errorMessage={formState.errors.description?.message}
                {...register("description", {
                  required: "A description is required.",
                })}
              />
            </div>
            <div>
              <TextField
                type="text"
                label={<Text fontWeight={600}>Price</Text>}
                hasError={!!formState.errors.price}
                errorMessage={formState.errors.price?.message}
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
              <Button type="submit">Create Product</Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
export default ProductCreate;
