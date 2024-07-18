/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage($filter: ModelSubscriptionImageFilterInput) {
    onCreateImage(filter: $filter) {
      alt
      createdAt
      id
      key
      product {
        createdAt
        description
        id
        name
        price
        updatedAt
        __typename
      }
      productId
      updatedAt
      __typename
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
      createdAt
      description
      id
      images {
        nextToken
        __typename
      }
      name
      price
      updatedAt
      __typename
    }
  }
`;
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage($filter: ModelSubscriptionImageFilterInput) {
    onDeleteImage(filter: $filter) {
      alt
      createdAt
      id
      key
      product {
        createdAt
        description
        id
        name
        price
        updatedAt
        __typename
      }
      productId
      updatedAt
      __typename
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
      createdAt
      description
      id
      images {
        nextToken
        __typename
      }
      name
      price
      updatedAt
      __typename
    }
  }
`;
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage($filter: ModelSubscriptionImageFilterInput) {
    onUpdateImage(filter: $filter) {
      alt
      createdAt
      id
      key
      product {
        createdAt
        description
        id
        name
        price
        updatedAt
        __typename
      }
      productId
      updatedAt
      __typename
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
      createdAt
      description
      id
      images {
        nextToken
        __typename
      }
      name
      price
      updatedAt
      __typename
    }
  }
`;
