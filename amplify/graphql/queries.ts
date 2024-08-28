/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getProduct = /* GraphQL */ `query GetProduct($id: ID!) {
  getProduct(id: $id) {
    createdAt
    description
    id
    images {
      nextToken
      __typename
    }
    isActive
    isArchived
    mainImageS3Key
    name
    price
    reviews {
      nextToken
      __typename
    }
    stripePriceId
    stripeProductId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProductQueryVariables,
  APITypes.GetProductQuery
>;
export const getProductImage = /* GraphQL */ `query GetProductImage($id: ID!) {
  getProductImage(id: $id) {
    alt
    createdAt
    id
    isArchived
    product {
      createdAt
      description
      id
      isActive
      isArchived
      mainImageS3Key
      name
      price
      stripePriceId
      stripeProductId
      updatedAt
      __typename
    }
    productId
    s3Key
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProductImageQueryVariables,
  APITypes.GetProductImageQuery
>;
export const getReview = /* GraphQL */ `query GetReview($id: ID!) {
  getReview(id: $id) {
    content
    createdAt
    id
    owner
    product {
      createdAt
      description
      id
      isActive
      isArchived
      mainImageS3Key
      name
      price
      stripePriceId
      stripeProductId
      updatedAt
      __typename
    }
    productId
    rating
    updatedAt
    user {
      birthdate
      createdAt
      email
      familyName
      givenName
      id
      middleName
      preferredUsername
      profileOwner
      profilePicture
      updatedAt
      userId
      username
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetReviewQueryVariables, APITypes.GetReviewQuery>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    birthdate
    createdAt
    email
    familyName
    givenName
    id
    middleName
    preferredUsername
    profileOwner
    profilePicture
    reviews {
      nextToken
      __typename
    }
    updatedAt
    userId
    username
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const getUserProfileByEmail = /* GraphQL */ `query GetUserProfileByEmail($email: String) {
  getUserProfileByEmail(email: $email) {
    birthdate
    createdAt
    email
    familyName
    givenName
    id
    middleName
    preferredUsername
    profileOwner
    profilePicture
    reviews {
      nextToken
      __typename
    }
    updatedAt
    userId
    username
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileByEmailQueryVariables,
  APITypes.GetUserProfileByEmailQuery
>;
export const listProductImageByProductId = /* GraphQL */ `query ListProductImageByProductId(
  $filter: ModelProductImageFilterInput
  $limit: Int
  $nextToken: String
  $productId: ID!
  $sortDirection: ModelSortDirection
) {
  listProductImageByProductId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    productId: $productId
    sortDirection: $sortDirection
  ) {
    items {
      alt
      createdAt
      id
      isArchived
      productId
      s3Key
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProductImageByProductIdQueryVariables,
  APITypes.ListProductImageByProductIdQuery
>;
export const listProductImages = /* GraphQL */ `query ListProductImages(
  $filter: ModelProductImageFilterInput
  $limit: Int
  $nextToken: String
) {
  listProductImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      alt
      createdAt
      id
      isArchived
      productId
      s3Key
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProductImagesQueryVariables,
  APITypes.ListProductImagesQuery
>;
export const listProducts = /* GraphQL */ `query ListProducts(
  $filter: ModelProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      id
      isActive
      isArchived
      mainImageS3Key
      name
      price
      stripePriceId
      stripeProductId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProductsQueryVariables,
  APITypes.ListProductsQuery
>;
export const listReviews = /* GraphQL */ `query ListReviews(
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      content
      createdAt
      id
      owner
      productId
      rating
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReviewsQueryVariables,
  APITypes.ListReviewsQuery
>;
export const listUserProfileByEmail = /* GraphQL */ `query ListUserProfileByEmail(
  $email: String!
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUserProfileByEmail(
    email: $email
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      birthdate
      createdAt
      email
      familyName
      givenName
      id
      middleName
      preferredUsername
      profileOwner
      profilePicture
      updatedAt
      userId
      username
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfileByEmailQueryVariables,
  APITypes.ListUserProfileByEmailQuery
>;
export const listUserProfileByUsername = /* GraphQL */ `query ListUserProfileByUsername(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $username: String!
) {
  listUserProfileByUsername(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    username: $username
  ) {
    items {
      birthdate
      createdAt
      email
      familyName
      givenName
      id
      middleName
      preferredUsername
      profileOwner
      profilePicture
      updatedAt
      userId
      username
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfileByUsernameQueryVariables,
  APITypes.ListUserProfileByUsernameQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      birthdate
      createdAt
      email
      familyName
      givenName
      id
      middleName
      preferredUsername
      profileOwner
      profilePicture
      updatedAt
      userId
      username
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
