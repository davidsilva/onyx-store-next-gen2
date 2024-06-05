/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $condition: ModelProductConditionInput
    $input: CreateProductInput!
  ) {
    createProduct(condition: $condition, input: $input) {
      createdAt
      description
      id
      image
      name
      price
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
      image
      name
      price
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
      image
      name
      price
      updatedAt
      __typename
    }
  }
`;
