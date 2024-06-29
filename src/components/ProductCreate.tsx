"use client";

import ProductCreateForm, {
  ProductCreateFormInputValues,
} from "@/ui-components/ProductCreateForm";
import { Card, Alert } from "@aws-amplify/ui-react";
import { useState } from "react";

const ProductCreate = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSuccess = () => {
    console.log("Product created successfully.");
    setIsSuccess(true);
    setIsError(false);
  };

  const handleError = () => {
    console.log("There was an error creating the product.");
    setIsError(true);
    setIsSuccess(false);
  };

  const handleSubmit = (
    fields: ProductCreateFormInputValues
  ): ProductCreateFormInputValues => {
    setIsError(false);
    setIsSuccess(false);
    console.log("fields", fields);
    return fields;
  };

  return (
    <Card>
      {isError && (
        <Alert variation="error" isDismissible={true}>
          There was an error creating the product.
        </Alert>
      )}

      {isSuccess && (
        <Alert variation="success" isDismissible={true}>
          Product created successfully.
        </Alert>
      )}

      <ProductCreateForm
        onSuccess={handleSuccess}
        onError={handleError}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
export default ProductCreate;
