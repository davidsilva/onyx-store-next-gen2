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
  Input,
  TextField,
  TextAreaField,
  Button,
} from "@aws-amplify/ui-react";
import { useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import ImageUploader from "./ImageUploader";

type FormData = {
  name: string;
  description: string;
  price: string;
};

type Image = {
  key: string;
  alt?: string;
};

const client = generateClient<Schema>({
  authMode: "userPool",
});

const ProductCreate = () => {
  const [images, setImages] = useState<Image[]>([]);
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Only called if form validation passes, i.e., formState.isValid is true
    console.log("form data", data);

    const result = await client.models.Product.create({
      name: data.name,
      description: data.description,
      price: parseInt(data.price, 10),
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
    }
  });

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label="Name"
            {...register("name", { required: "A name is required." })}
          />
          <p>{formState.errors.name?.message}</p>
        </div>
        <div>
          <TextAreaField
            label="Description"
            {...register("description", {
              required: "A description is required.",
            })}
          />
          <p>{formState.errors.description?.message}</p>
        </div>
        <div>
          <TextField
            type="number"
            label="Price"
            {...register("price", {
              required: "A price is required.",
              min: { value: 0, message: "Price must be greater than 0" },
            })}
          />
          <p>{formState.errors.price?.message}</p>
        </div>
        {images.length > 0 && (
          <ol>
            {images.map((image, idx) => (
              <li key={idx}>{image.key}</li>
            ))}
          </ol>
        )}
        <div>
          <ImageUploader setImages={setImages} images={images} />
        </div>
        <div>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Card>
  );
};
export default ProductCreate;
