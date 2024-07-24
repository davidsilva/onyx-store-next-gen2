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
    /* 
      Eventually we will have some kind of soft delete. 

      How can we implement a custom mutation in AWS Amplify delete (hard or soft) a product and its associated images? The documentation is essentially here: https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/
    */
    try {
      const imagesToDeleteResult =
        await client.models.ProductImage.listProductImageByProductId(
          {
            productId: id,
          },
          { authMode: "userPool" }
        );
      console.log("imagesToDeleteResult", imagesToDeleteResult);

      const imagesToDeleteIds = imagesToDeleteResult.data?.map(
        (image) => image.id
      );

      imagesToDeleteIds.forEach(async (imageId) => {
        await client.models.ProductImage.delete(
          { id: imageId },
          { authMode: "userPool" }
        );
      });

      const productDeleteResult = await client.models.Product.delete(
        { id },
        { authMode: "userPool" }
      );
      console.log("Deleted product", productDeleteResult);

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
