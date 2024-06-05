import { cookieBasedClient } from "@/utils/amplify-utils";

export default async function Home() {
  const { data: products, errors } =
    await cookieBasedClient.models.Product.list();

  console.log("products", products);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello, world!</h1>
      {products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </main>
  );
}
