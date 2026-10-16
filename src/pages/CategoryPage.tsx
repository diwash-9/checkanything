import { useParams } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Converter } from "@/components/converter";
import { getCategory } from "@/domain/units/registry";
import NotFoundPage from "./NotFoundPage";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = categoryId ? getCategory(categoryId) : undefined;

  if (!category) {
    return <NotFoundPage />;
  }

  return (
    <Container className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{category.name} converter</h1>
        <p className="mt-1 text-sm text-gray-600">
          Convert between {category.units.length} {category.name.toLowerCase()} units.
        </p>
      </header>

      <Converter category={category} />
    </Container>
  );
}
