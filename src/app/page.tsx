import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated, checkIsAdmin } from "@/utils/amplify-utils";
import ProductItem from "@/components/ProductItem";

export default async function Home() {
  const isSignedIn = await checkIsAuthenticated();
  const isAdmin = await checkIsAdmin();
  const { data: products, errors } =
    await cookieBasedClient.models.Product.list({
      authMode: isSignedIn ? "userPool" : "iam",
    });

  console.log("products", products);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello, world!</h1>
      {products?.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </main>
  );
}
