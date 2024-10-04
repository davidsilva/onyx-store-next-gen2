"use client";

/* 
- The product ID won't be available until the product is created, so the image record creation is done after the product creation.
- The user is able to enter information and upload or remove images in any order.
- The user can add multiple images.
- The ProductImages will stay in the S3 bucket even if the product is deleted, and even if the ProductImage records are deleted.
- We could have a script that runs periodically to delete ProductImages that are not associated with any product.
*/
import { generateClient } from "@aws-amplify/api";
import { Card, Alert } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import clearCachesByServerAction from "@/actions/revalidate";
import { Product, ProductImage, Message } from "@/types";
import ProductForm from "./ProductForm";
import { convertPriceToCentsInteger } from "@/utils/util";

type FormData = Omit<Product, "id" | "images" | "isArchived" | "price"> & {
  price: string;
};

const client = generateClient<Schema>({
  authMode: "userPool",
});

const ProductCreate = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  const onSubmit = async (data: FormData) => {
    // Only called if form validation passes.
    console.log("form data", data);

    // Eventually we should be able to make all this into a custom mutation
    try {
      const result = await client.models.Product.create({
        name: data.name,
        description: data.description,
        price: convertPriceToCentsInteger(data.price), // convert to cents
        mainImageS3Key: data.mainImageS3Key,
        status: data.status,
      });

      console.log("product create result", result);

      const productId = result.data?.id;

      if (productId) {
        for (const image of images) {
          await client.models.ProductImage.create({
            s3Key: image.s3Key,
            alt: image.alt,
            productId,
          });
        }

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
  };

  return (
    <Card>
      {message ? (
        <Alert variation={message.type}>{message.content}</Alert>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Create Product
          </h1>
          <ProductForm
            product={product}
            setProduct={setProduct}
            images={images}
            setImages={setImages}
            onSubmit={onSubmit}
          />
        </>
      )}
    </Card>
  );
};
export default ProductCreate;
