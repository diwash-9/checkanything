import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CategoryPage from "@/pages/CategoryPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PairPage from "@/pages/PairPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path=":categoryId" element={<CategoryPage />} />
        <Route path=":categoryId/:pairSlug" element={<PairPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
