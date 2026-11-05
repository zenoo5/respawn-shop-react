import { useProducts } from "../features/products/useProducts";
import { Hero } from "../features/products/components/Highlights";
import { ProductStatus } from "../features/products/components/ProductStatus";
import { PageLayout } from "../components/layout/PageLayout";
import { Storefront } from "./Storefront";
export default function App() {
  const { state, retry } = useProducts();
  if (state.status === "success") return <Storefront products={state.data} />;
  return (
    <PageLayout>
      <Hero products={[]} />
      <ProductStatus state={state} onRetry={retry} />
    </PageLayout>
  );
}
