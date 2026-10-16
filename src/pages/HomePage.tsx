import { Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Converter } from "@/components/converter";
import Card from "@/components/ui/Card";
import { SITE } from "@/config/site";
import { listCategories } from "@/domain/units/registry";

export default function HomePage() {
  const categories = listCategories();
  const featured = categories[0];

  return (
    <Container className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Convert anything to anything
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{SITE.description}</p>
      </section>

      {featured && <Converter category={featured} />}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <Link key={category.id} to={`/${category.id}`} className="block">
              <Card className="transition hover:border-blue-300 hover:shadow-md">
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {category.units.length} units
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
