/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateProduct = /* GraphQL */ `subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
  onCreateProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProductSubscriptionVariables,
  APITypes.OnCreateProductSubscription
>;
export const onCreateProductImage = /* GraphQL */ `subscription OnCreateProductImage(
  $filter: ModelSubscriptionProductImageFilterInput
) {
  onCreateProductImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProductImageSubscriptionVariables,
  APITypes.OnCreateProductImageSubscription
>;
export const onCreateReview = /* GraphQL */ `subscription OnCreateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onCreateReview(filter: $filter, owner: $owner) {
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
    title
    updatedAt
    user {
      birthdate
      createdAt
      email
      familyName
      favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnCreateReviewSubscriptionVariables,
  APITypes.OnCreateReviewSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onCreateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    birthdate
    createdAt
    email
    familyName
    favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteProduct = /* GraphQL */ `subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
  onDeleteProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProductSubscriptionVariables,
  APITypes.OnDeleteProductSubscription
>;
export const onDeleteProductImage = /* GraphQL */ `subscription OnDeleteProductImage(
  $filter: ModelSubscriptionProductImageFilterInput
) {
  onDeleteProductImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProductImageSubscriptionVariables,
  APITypes.OnDeleteProductImageSubscription
>;
export const onDeleteReview = /* GraphQL */ `subscription OnDeleteReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onDeleteReview(filter: $filter, owner: $owner) {
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
    title
    updatedAt
    user {
      birthdate
      createdAt
      email
      familyName
      favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnDeleteReviewSubscriptionVariables,
  APITypes.OnDeleteReviewSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onDeleteUserProfile(filter: $filter, profileOwner: $profileOwner) {
    birthdate
    createdAt
    email
    familyName
    favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateProduct = /* GraphQL */ `subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
  onUpdateProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProductSubscriptionVariables,
  APITypes.OnUpdateProductSubscription
>;
export const onUpdateProductImage = /* GraphQL */ `subscription OnUpdateProductImage(
  $filter: ModelSubscriptionProductImageFilterInput
) {
  onUpdateProductImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProductImageSubscriptionVariables,
  APITypes.OnUpdateProductImageSubscription
>;
export const onUpdateReview = /* GraphQL */ `subscription OnUpdateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onUpdateReview(filter: $filter, owner: $owner) {
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
    title
    updatedAt
    user {
      birthdate
      createdAt
      email
      familyName
      favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnUpdateReviewSubscriptionVariables,
  APITypes.OnUpdateReviewSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onUpdateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    birthdate
    createdAt
    email
    familyName
    favoriteColor
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
