import { Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Not found</h1>
      <p className="text-sm text-gray-600">
        We couldn&apos;t find that converter. It may not exist yet.
      </p>
      <Link to="/">
        <Button>Back to the converter</Button>
      </Link>
    </Container>
  );
}
