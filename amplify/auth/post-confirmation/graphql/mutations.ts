/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const archiveProduct = /* GraphQL */ `mutation ArchiveProduct($archive: Boolean, $productId: ID) {
  archiveProduct(archive: $archive, productId: $productId) {
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
` as GeneratedMutation<
  APITypes.ArchiveProductMutationVariables,
  APITypes.ArchiveProductMutation
>;
export const createProduct = /* GraphQL */ `mutation CreateProduct(
  $condition: ModelProductConditionInput
  $input: CreateProductInput!
) {
  createProduct(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProductMutationVariables,
  APITypes.CreateProductMutation
>;
export const createProductImage = /* GraphQL */ `mutation CreateProductImage(
  $condition: ModelProductImageConditionInput
  $input: CreateProductImageInput!
) {
  createProductImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProductImageMutationVariables,
  APITypes.CreateProductImageMutation
>;
export const createReview = /* GraphQL */ `mutation CreateReview(
  $condition: ModelReviewConditionInput
  $input: CreateReviewInput!
) {
  createReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateReviewMutationVariables,
  APITypes.CreateReviewMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteProduct = /* GraphQL */ `mutation DeleteProduct(
  $condition: ModelProductConditionInput
  $input: DeleteProductInput!
) {
  deleteProduct(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProductMutationVariables,
  APITypes.DeleteProductMutation
>;
export const deleteProductImage = /* GraphQL */ `mutation DeleteProductImage(
  $condition: ModelProductImageConditionInput
  $input: DeleteProductImageInput!
) {
  deleteProductImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProductImageMutationVariables,
  APITypes.DeleteProductImageMutation
>;
export const deleteReview = /* GraphQL */ `mutation DeleteReview(
  $condition: ModelReviewConditionInput
  $input: DeleteReviewInput!
) {
  deleteReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteReviewMutationVariables,
  APITypes.DeleteReviewMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateProduct = /* GraphQL */ `mutation UpdateProduct(
  $condition: ModelProductConditionInput
  $input: UpdateProductInput!
) {
  updateProduct(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProductMutationVariables,
  APITypes.UpdateProductMutation
>;
export const updateProductImage = /* GraphQL */ `mutation UpdateProductImage(
  $condition: ModelProductImageConditionInput
  $input: UpdateProductImageInput!
) {
  updateProductImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProductImageMutationVariables,
  APITypes.UpdateProductImageMutation
>;
export const updateReview = /* GraphQL */ `mutation UpdateReview(
  $condition: ModelReviewConditionInput
  $input: UpdateReviewInput!
) {
  updateReview(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateReviewMutationVariables,
  APITypes.UpdateReviewMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
