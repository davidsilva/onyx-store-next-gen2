"use client";

import { generateClient } from "@aws-amplify/api";
import { Card, Alert, Text } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { type Schema } from "@/../amplify/data/resource";
import clearCachesByServerAction from "@/actions/revalidate";
import { Product, ProductImage } from "@/types";
import ProductForm from "./ProductForm";
import { convertPriceToCentsInteger } from "@/utils/util";

type FormData = Omit<Product, "id" | "images" | "price" | "isArchived"> & {
  price: string;
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

const ProductUpdate = ({ id }: ProductUpdateProps) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

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
              "status",
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
  }, [id]);

  const onSubmit = async (data: FormData) => {
    // Only called if form validation passes, i.e., formState.isValid is true
    // Among possible improvements: check if the form data is different from the original data before submitting the update. We could maybe use the isDirty property from the formState object.
    console.log("form data", data);
    try {
      // Rather than figure out which images are new, updated or removed, we'll just dissassociate all the images associated with the product and then create them all again.
      const relatedImagesResult =
        await client.models.ProductImage.listProductImageByProductId({
          productId: id,
        });
      console.log("relatedImagesResult", relatedImagesResult);

      // Turn relatedImagesResult into an array of image ids. data is an array of objects, each with an id property.
      const relatedImageIds = relatedImagesResult.data.map((image) => image.id);

      // Un-relate and archive all images associated with the product.
      for (const id of relatedImageIds) {
        const unrelateResult = await client.models.ProductImage.update({
          id,
          productId: null,
          isArchived: true,
        });
        console.log("image unrelateResult", unrelateResult);
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
        mainImageS3Key: data.mainImageS3Key,
        status: data.status,
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
  };

  if (!product) {
    return (
      <Card>
        <Text>No product...</Text>
      </Card>
    );
  }

  return (
    <Card>
      {message ? (
        <Alert variation={message.type}>{message.content}</Alert>
      ) : (
        <>
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
export default ProductUpdate;
