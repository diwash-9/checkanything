import { SITE } from "@/config/site";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200">
      <Container className="flex flex-col items-center gap-1 py-6 text-center text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {SITE.author}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
