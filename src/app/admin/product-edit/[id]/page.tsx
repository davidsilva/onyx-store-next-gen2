import ProductEdit from "@/components/ProductEdit";

export default function ProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <ProductEdit id={params.id} />
    </div>
  );
}
