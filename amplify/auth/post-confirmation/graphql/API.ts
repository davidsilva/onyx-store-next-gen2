/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Product = {
  __typename: "Product",
  createdAt: string,
  description: string,
  id: string,
  images?: ModelProductImageConnection | null,
  isActive?: boolean | null,
  isArchived?: boolean | null,
  mainImageS3Key?: string | null,
  name: string,
  price: number,
  reviews?: ModelReviewConnection | null,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
  updatedAt: string,
};

export type ModelProductImageConnection = {
  __typename: "ModelProductImageConnection",
  items:  Array<ProductImage | null >,
  nextToken?: string | null,
};

export type ProductImage = {
  __typename: "ProductImage",
  alt?: string | null,
  createdAt: string,
  id: string,
  isArchived?: boolean | null,
  product?: Product | null,
  productId?: string | null,
  s3Key?: string | null,
  updatedAt: string,
};

export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items:  Array<Review | null >,
  nextToken?: string | null,
};

export type Review = {
  __typename: "Review",
  content: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  product?: Product | null,
  productId?: string | null,
  rating: number,
  title: string,
  updatedAt: string,
  user?: UserProfile | null,
  userId?: string | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  birthdate?: string | null,
  createdAt: string,
  email?: string | null,
  familyName?: string | null,
  favoriteColor?: string | null,
  givenName?: string | null,
  id: string,
  middleName?: string | null,
  preferredUsername?: string | null,
  profileOwner?: string | null,
  profilePicture?: string | null,
  reviews?: ModelReviewConnection | null,
  updatedAt: string,
  userId: string,
  username: string,
};

export type ModelProductImageFilterInput = {
  alt?: ModelStringInput | null,
  and?: Array< ModelProductImageFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isArchived?: ModelBooleanInput | null,
  not?: ModelProductImageFilterInput | null,
  or?: Array< ModelProductImageFilterInput | null > | null,
  productId?: ModelIDInput | null,
  s3Key?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelProductFilterInput = {
  and?: Array< ModelProductFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  isArchived?: ModelBooleanInput | null,
  mainImageS3Key?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelProductFilterInput | null,
  or?: Array< ModelProductFilterInput | null > | null,
  price?: ModelIntInput | null,
  stripePriceId?: ModelStringInput | null,
  stripeProductId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelProductConnection = {
  __typename: "ModelProductConnection",
  items:  Array<Product | null >,
  nextToken?: string | null,
};

export type ModelReviewFilterInput = {
  and?: Array< ModelReviewFilterInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelReviewFilterInput | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  productId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  birthdate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  familyName?: ModelStringInput | null,
  favoriteColor?: ModelStringInput | null,
  givenName?: ModelStringInput | null,
  id?: ModelIDInput | null,
  middleName?: ModelStringInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  preferredUsername?: ModelStringInput | null,
  profileOwner?: ModelStringInput | null,
  profilePicture?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  username?: ModelStringInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelProductConditionInput = {
  and?: Array< ModelProductConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  isArchived?: ModelBooleanInput | null,
  mainImageS3Key?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelProductConditionInput | null,
  or?: Array< ModelProductConditionInput | null > | null,
  price?: ModelIntInput | null,
  stripePriceId?: ModelStringInput | null,
  stripeProductId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProductInput = {
  description: string,
  id?: string | null,
  isActive?: boolean | null,
  isArchived?: boolean | null,
  mainImageS3Key?: string | null,
  name: string,
  price: number,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
};

export type ModelProductImageConditionInput = {
  alt?: ModelStringInput | null,
  and?: Array< ModelProductImageConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  not?: ModelProductImageConditionInput | null,
  or?: Array< ModelProductImageConditionInput | null > | null,
  productId?: ModelIDInput | null,
  s3Key?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProductImageInput = {
  alt?: string | null,
  id?: string | null,
  isArchived?: boolean | null,
  productId?: string | null,
  s3Key?: string | null,
};

export type ModelReviewConditionInput = {
  and?: Array< ModelReviewConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelReviewConditionInput | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  owner?: ModelStringInput | null,
  productId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type CreateReviewInput = {
  content: string,
  id?: string | null,
  productId?: string | null,
  rating: number,
  title: string,
  userId?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  birthdate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  familyName?: ModelStringInput | null,
  favoriteColor?: ModelStringInput | null,
  givenName?: ModelStringInput | null,
  middleName?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  preferredUsername?: ModelStringInput | null,
  profileOwner?: ModelStringInput | null,
  profilePicture?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  username?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  birthdate?: string | null,
  email?: string | null,
  familyName?: string | null,
  favoriteColor?: string | null,
  givenName?: string | null,
  id?: string | null,
  middleName?: string | null,
  preferredUsername?: string | null,
  profileOwner?: string | null,
  profilePicture?: string | null,
  userId: string,
  username: string,
};

export type DeleteProductInput = {
  id: string,
};

export type DeleteProductImageInput = {
  id: string,
};

export type DeleteReviewInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateProductInput = {
  description?: string | null,
  id: string,
  isActive?: boolean | null,
  isArchived?: boolean | null,
  mainImageS3Key?: string | null,
  name?: string | null,
  price?: number | null,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
};

export type UpdateProductImageInput = {
  alt?: string | null,
  id: string,
  isArchived?: boolean | null,
  productId?: string | null,
  s3Key?: string | null,
};

export type UpdateReviewInput = {
  content?: string | null,
  id: string,
  productId?: string | null,
  rating?: number | null,
  title?: string | null,
  userId?: string | null,
};

export type UpdateUserProfileInput = {
  birthdate?: string | null,
  email?: string | null,
  familyName?: string | null,
  favoriteColor?: string | null,
  givenName?: string | null,
  id: string,
  middleName?: string | null,
  preferredUsername?: string | null,
  profileOwner?: string | null,
  profilePicture?: string | null,
  userId?: string | null,
  username?: string | null,
};

export type ModelSubscriptionProductFilterInput = {
  and?: Array< ModelSubscriptionProductFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  mainImageS3Key?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionProductFilterInput | null > | null,
  price?: ModelSubscriptionIntInput | null,
  stripePriceId?: ModelSubscriptionStringInput | null,
  stripeProductId?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionProductImageFilterInput = {
  alt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProductImageFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionProductImageFilterInput | null > | null,
  productId?: ModelSubscriptionIDInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionReviewFilterInput = {
  and?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  productId?: ModelSubscriptionIDInput | null,
  rating?: ModelSubscriptionIntInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  birthdate?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  familyName?: ModelSubscriptionStringInput | null,
  favoriteColor?: ModelSubscriptionStringInput | null,
  givenName?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  middleName?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  preferredUsername?: ModelSubscriptionStringInput | null,
  profileOwner?: ModelStringInput | null,
  profilePicture?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
  username?: ModelSubscriptionStringInput | null,
};

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetProductImageQueryVariables = {
  id: string,
};

export type GetProductImageQuery = {
  getProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type GetReviewQueryVariables = {
  id: string,
};

export type GetReviewQuery = {
  getReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type ListProductImageByProductIdQueryVariables = {
  filter?: ModelProductImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  productId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListProductImageByProductIdQuery = {
  listProductImageByProductId?:  {
    __typename: "ModelProductImageConnection",
    items:  Array< {
      __typename: "ProductImage",
      alt?: string | null,
      createdAt: string,
      id: string,
      isArchived?: boolean | null,
      productId?: string | null,
      s3Key?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProductImagesQueryVariables = {
  filter?: ModelProductImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductImagesQuery = {
  listProductImages?:  {
    __typename: "ModelProductImageConnection",
    items:  Array< {
      __typename: "ProductImage",
      alt?: string | null,
      createdAt: string,
      id: string,
      isArchived?: boolean | null,
      productId?: string | null,
      s3Key?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts?:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListReviewByProductIdQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  productId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListReviewByProductIdQuery = {
  listReviewByProductId?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      content: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      productId?: string | null,
      rating: number,
      title: string,
      updatedAt: string,
      userId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListReviewByUserIdQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListReviewByUserIdQuery = {
  listReviewByUserId?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      content: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      productId?: string | null,
      rating: number,
      title: string,
      updatedAt: string,
      userId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListReviewsQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  listReviews?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      content: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      productId?: string | null,
      rating: number,
      title: string,
      updatedAt: string,
      userId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfileByEmailQueryVariables = {
  email: string,
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserProfileByEmailQuery = {
  listUserProfileByEmail?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfileByUserIdQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListUserProfileByUserIdQuery = {
  listUserProfileByUserId?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfileByUsernameQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username: string,
};

export type ListUserProfileByUsernameQuery = {
  listUserProfileByUsername?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ArchiveProductMutationVariables = {
  archive?: boolean | null,
  productId?: string | null,
};

export type ArchiveProductMutation = {
  archiveProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateProductMutationVariables = {
  condition?: ModelProductConditionInput | null,
  input: CreateProductInput,
};

export type CreateProductMutation = {
  createProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateProductImageMutationVariables = {
  condition?: ModelProductImageConditionInput | null,
  input: CreateProductImageInput,
};

export type CreateProductImageMutation = {
  createProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: CreateReviewInput,
};

export type CreateReviewMutation = {
  createReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type DeleteProductMutationVariables = {
  condition?: ModelProductConditionInput | null,
  input: DeleteProductInput,
};

export type DeleteProductMutation = {
  deleteProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteProductImageMutationVariables = {
  condition?: ModelProductImageConditionInput | null,
  input: DeleteProductImageInput,
};

export type DeleteProductImageMutation = {
  deleteProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: DeleteReviewInput,
};

export type DeleteReviewMutation = {
  deleteReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type UpdateProductMutationVariables = {
  condition?: ModelProductConditionInput | null,
  input: UpdateProductInput,
};

export type UpdateProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateProductImageMutationVariables = {
  condition?: ModelProductImageConditionInput | null,
  input: UpdateProductImageInput,
};

export type UpdateProductImageMutation = {
  updateProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateReviewMutationVariables = {
  condition?: ModelReviewConditionInput | null,
  input: UpdateReviewInput,
};

export type UpdateReviewMutation = {
  updateReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnCreateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnCreateProductSubscription = {
  onCreateProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateProductImageSubscriptionVariables = {
  filter?: ModelSubscriptionProductImageFilterInput | null,
};

export type OnCreateProductImageSubscription = {
  onCreateProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnCreateReviewSubscription = {
  onCreateReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnDeleteProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteProductImageSubscriptionVariables = {
  filter?: ModelSubscriptionProductImageFilterInput | null,
};

export type OnDeleteProductImageSubscription = {
  onDeleteProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReviewSubscription = {
  onDeleteReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};

export type OnUpdateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?:  {
    __typename: "Product",
    createdAt: string,
    description: string,
    id: string,
    images?:  {
      __typename: "ModelProductImageConnection",
      nextToken?: string | null,
    } | null,
    isActive?: boolean | null,
    isArchived?: boolean | null,
    mainImageS3Key?: string | null,
    name: string,
    price: number,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateProductImageSubscriptionVariables = {
  filter?: ModelSubscriptionProductImageFilterInput | null,
};

export type OnUpdateProductImageSubscription = {
  onUpdateProductImage?:  {
    __typename: "ProductImage",
    alt?: string | null,
    createdAt: string,
    id: string,
    isArchived?: boolean | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    s3Key?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReviewSubscription = {
  onUpdateReview?:  {
    __typename: "Review",
    content: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    product?:  {
      __typename: "Product",
      createdAt: string,
      description: string,
      id: string,
      isActive?: boolean | null,
      isArchived?: boolean | null,
      mainImageS3Key?: string | null,
      name: string,
      price: number,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      updatedAt: string,
    } | null,
    productId?: string | null,
    rating: number,
    title: string,
    updatedAt: string,
    user?:  {
      __typename: "UserProfile",
      birthdate?: string | null,
      createdAt: string,
      email?: string | null,
      familyName?: string | null,
      favoriteColor?: string | null,
      givenName?: string | null,
      id: string,
      middleName?: string | null,
      preferredUsername?: string | null,
      profileOwner?: string | null,
      profilePicture?: string | null,
      updatedAt: string,
      userId: string,
      username: string,
    } | null,
    userId?: string | null,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    birthdate?: string | null,
    createdAt: string,
    email?: string | null,
    familyName?: string | null,
    favoriteColor?: string | null,
    givenName?: string | null,
    id: string,
    middleName?: string | null,
    preferredUsername?: string | null,
    profileOwner?: string | null,
    profilePicture?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
    userId: string,
    username: string,
  } | null,
};
