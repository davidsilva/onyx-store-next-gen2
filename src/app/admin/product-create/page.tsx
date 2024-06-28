import ProductCreate from "@/components/ProductCreate";
import { isAdmin } from "@/utils/amplify-utils";

const ProductCreatePage = async () => {
  const useIsAdmin = await isAdmin();
  if (!useIsAdmin) {
    return <div>Unauthorized</div>;
  }

  return <ProductCreate />;
};
export default ProductCreatePage;
