import { type Schema } from "@/../amplify/data/resource";

export type Nullable<T> = T | null;

type ProductFromSchema = Schema["Product"]["type"];

// Use id, name, description, price, isArchived, and isActive from the schema.
// images is derived from the schema using the definition below.
// This seems like a good way limiting the definition to what we need in the code and not including what Amplify adds.
export type Product = Omit<
  Pick<
    ProductFromSchema,
    "id" | "name" | "description" | "price" | "isArchived" | "isActive"
  >,
  "images"
> & {
  images: Image[];
  mainImageS3Key: Nullable<string>;
};

type ImageFromSchema = Schema["ProductImage"]["type"];

// id, alt, and productId are optional
// s3Key is required and can be Nullable<string>
export type Image = Partial<
  Pick<ImageFromSchema, "id" | "s3Key" | "alt" | "productId">
> & {
  s3Key: Nullable<string>;
};
