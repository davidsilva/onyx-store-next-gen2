"use client";

import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/../amplify/data/resource";
import clearCachesByServerAction from "@/actions/revalidate";
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

  console.log("ProductItemControls", product);

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/product-edit/${id}`);
  };

  const handleDelete = async () => {
    /* 
      How can we implement a custom mutation in AWS Amplify delete (hard or soft) a product and its associated images in one go? The documentation is essentially here: https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/.

      We could also have an event trigger that listens for a product deletion/archiving and deletes/archives the associated images using a Lambda function.
    */
    try {
      const imagesToArchiveResult =
        await client.models.ProductImage.listProductImageByProductId(
          {
            productId: id,
          },
          { authMode: "userPool" }
        );
      console.log("imagesToArchiveResult", imagesToArchiveResult);

      const imagesToArchiveIds = imagesToArchiveResult.data?.map(
        (image) => image.id
      );

      imagesToArchiveIds.forEach(async (imageId) => {
        await client.models.ProductImage.update(
          { id: imageId, isArchived: true, productId: null },
          { authMode: "userPool" }
        );
      });

      const archiveProductResult = await client.mutations.archiveProduct(
        { productId: id, archive: !product.isArchived },
        { authMode: "userPool" }
      );
      console.log("Archived product", archiveProductResult);

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
            {product.isArchived ? "Restore" : "Archive"}
          </button>
        </>
      )}
    </div>
  );
};

export default ProductItemControls;
