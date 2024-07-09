"use client";

import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/../amplify/data/resource";
import clearCachesByServerAction from "@/actions/revalidate";
import { useAdminContext } from "@/context/AdminContext";

interface ProductItemControlsProps {
  id: string;
  isSignedIn: boolean;
}

const client = generateClient<Schema>();

const ProductItemControls = ({ id, isSignedIn }: ProductItemControlsProps) => {
  const { isAdmin } = useAdminContext();

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/product-edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const result = await client.models.Product.delete(
        { id },
        { authMode: "userPool" }
      );
      console.log("Deleted product", result);
      clearCachesByServerAction();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button className="btn btn-blue">Add to Cart</button>
      {isSignedIn && <button className="btn btn-blue">Add Review</button>}
      {isAdmin && (
        <>
          <button className="btn btn-blue" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-blue" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ProductItemControls;
