"use client";

import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/../amplify/data/resource";
import { useAdminContext } from "@/context/AdminContext";
import { Product } from "@/types";

interface ProductItemControlsProps {
  product: Product;
  isSignedIn: boolean;
}

const client = generateClient<Schema>();

const ProductItemControls = ({
  product,
  isSignedIn,
}: ProductItemControlsProps) => {
  const { id } = product;
  const { isAdmin } = useAdminContext();

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/product-edit/${id}`);
  };

  const handleReview = () => {
    router.push(`/reviews/product/${id}/new`);
  };

  return (
    <div className="flex gap-2">
      <button className="btn btn-blue">Add to Cart</button>
      {isSignedIn && (
        <button className="btn btn-blue" onClick={handleReview}>
          Add Review
        </button>
      )}
      {isAdmin && (
        <>
          <button className="btn btn-blue" onClick={handleEdit}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default ProductItemControls;
