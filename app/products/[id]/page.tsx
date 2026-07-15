import ProductDetail from "./ProductDetail";

export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProductDetail id={params.id} />;
}
