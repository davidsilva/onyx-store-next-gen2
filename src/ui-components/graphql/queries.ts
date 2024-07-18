/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
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
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
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
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        alt
        createdAt
        id
        key
        productId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        description
        id
        name
        price
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
