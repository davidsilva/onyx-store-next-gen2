"use client";

import ProductUpdateForm, {
  ProductUpdateFormInputValues,
} from "@/ui-components/ProductUpdateForm";
import { Card, Alert } from "@aws-amplify/ui-react";
import { useState } from "react";
import clearCachesByServerAction from "@/actions/revalidate";

interface ProductUpdateProps {
  id: string;
}

const ProductUpdate = ({ id }: ProductUpdateProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSuccess = () => {
    console.log("Product updated successfully.");
    setIsSuccess(true);
    setIsError(false);
    clearCachesByServerAction();
  };

  const handleError = () => {
    console.log("There was an error creating the product.");
    setIsError(true);
    setIsSuccess(false);
  };

  const handleSubmit = (
    fields: ProductUpdateFormInputValues
  ): ProductUpdateFormInputValues => {
    setIsError(false);
    setIsSuccess(false);
    console.log("fields", fields);
    return fields;
  };

  return (
    <Card>
      {isError && (
        <Alert variation="error" isDismissible={true}>
          There was an error updating the product.
        </Alert>
      )}

      {isSuccess && (
        <Alert variation="success" isDismissible={true}>
          Product updated successfully.
        </Alert>
      )}

      <ProductUpdateForm
        onSuccess={handleSuccess}
        onError={handleError}
        onSubmit={handleSubmit}
        id={id}
      />
    </Card>
  );
};
export default ProductUpdate;
