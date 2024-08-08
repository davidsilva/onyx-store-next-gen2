export type Nullable<T> = T | null;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
  mainImageS3Key: Nullable<string>;
  isArchived: boolean | null;
};

export type Image = {
  id?: string;
  s3Key: Nullable<string>;
  alt?: string | null;
  productId?: Nullable<string>;
};
