import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated } from "@/utils/amplify-utils";
import ProductItem from "@/components/ProductItem";

export default async function Home() {
  const isSignedIn = await checkIsAuthenticated();
  let products = null;
  try {
    const { data, errors } = await cookieBasedClient.models.Product.list({
      authMode: isSignedIn ? "userPool" : "iam",
      selectionSet: [
        "id",
        "name",
        "description",
        "price",
        "mainImageS3Key",
        "images.*",
      ],
    });

    console.log("products", products);
    console.log("errors", errors);
    products = data;
  } catch (error) {
    console.error("error", error);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      {products &&
        products?.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            isSignedIn={isSignedIn}
          />
        ))}
    </main>
  );
}
