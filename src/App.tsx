import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Spinner } from "@chakra-ui/react";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import "./styles.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const TVDetailPage = lazy(() => import("./pages/TVDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageFallback() {
  return (
    <Box textAlign="center" mt={20}>
      <Spinner size="xl" />
    </Box>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<TVDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
