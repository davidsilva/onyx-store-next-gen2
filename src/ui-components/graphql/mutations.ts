/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $condition: ModelImageConditionInput
    $input: CreateImageInput!
  ) {
    createImage(condition: $condition, input: $input) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
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
      name
      price
      updatedAt
      __typename
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage(
    $condition: ModelImageConditionInput
    $input: DeleteImageInput!
  ) {
    deleteImage(condition: $condition, input: $input) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
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
      name
      price
      updatedAt
      __typename
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage(
    $condition: ModelImageConditionInput
    $input: UpdateImageInput!
  ) {
    updateImage(condition: $condition, input: $input) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
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
      name
      price
      updatedAt
      __typename
    }
  }
`;
