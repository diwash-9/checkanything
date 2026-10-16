import { Link, NavLink } from "react-router-dom";
import { SITE } from "@/config/site";
import { listCategories } from "@/domain/units/registry";
import Container from "./Container";

export default function Header() {
  const categories = listCategories();
  return (
    <header className="border-b border-gray-200">
      <Container className="flex items-center justify-between py-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-gray-900">
          Check<span className="text-blue-600">Anything</span>
        </Link>
        <nav aria-label="Categories" className="flex gap-4 text-sm">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              to={`/${category.id}`}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }
            >
              {category.name}
            </NavLink>
          ))}
        </nav>
      </Container>
      <span className="sr-only">{SITE.tagline}</span>
    </header>
  );
}
