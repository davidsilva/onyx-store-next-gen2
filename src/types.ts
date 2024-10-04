import { type Schema } from "@/../amplify/data/resource";

export type Nullable<T> = T | null;

type ProductFromSchema = Schema["Product"]["type"];

type ReviewFromSchema = Schema["Review"]["type"];

// Use id, name, description, price, isArchived, and isActive from the schema.
// images is derived from the schema using the definition below.
// This seems like a good way limiting the definition to what we need in the code and not including what Amplify adds.
export type Product = Omit<
  Pick<
    ProductFromSchema,
    "id" | "name" | "description" | "price" | "isArchived" | "status"
  >,
  "images"
> & {
  images: ProductImage[];
  mainImageS3Key: Nullable<string>;
};

export type ProductWithReviews = Product & {
  reviews: Review[];
};

type ProductImageFromSchema = Schema["ProductImage"]["type"];

// id, alt, and productId are optional
// s3Key is required and can be Nullable<string>
export type ProductImage = Partial<
  Pick<ProductImageFromSchema, "id" | "s3Key" | "alt" | "productId">
> & {
  s3Key: Nullable<string>;
};

export type Review = Omit<
  ReviewFromSchema,
  "product" | "user" | "updatedAt" | "createdAt" | "id"
>;

export type ReviewItem = {
  id: string;
  title: string;
  content: string;
  rating: number;
  productId?: string | null;
  productName?: string;
  preferredUsername?: string;
  userId?: string | null;
  createdAt: string;
};

export type Message = {
  type: "error" | "success";
  content: string;
};

export enum AsyncProcessStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface AsyncProcessBase {
  status: AsyncProcessStatus;
}

export interface AsyncProcessNone extends AsyncProcessBase {
  status: AsyncProcessStatus.NONE;
}

export interface AsyncProcessPending<T> extends AsyncProcessBase {
  status: AsyncProcessStatus.PENDING;
  value?: T;
}

export interface AsyncProcessError<T, E> extends AsyncProcessBase {
  status: AsyncProcessStatus.ERROR;
  error: E;
  value?: T;
}

export interface AsyncProcessSuccess<T> extends AsyncProcessBase {
  status: AsyncProcessStatus.SUCCESS;
  value?: T;
}

export type AsyncProcess<T, E> =
  | AsyncProcessNone
  | AsyncProcessPending<T>
  | AsyncProcessError<T, E>
  | AsyncProcessSuccess<T>;
