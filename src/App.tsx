import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import TVDetailPage from "./pages/TvDetailPage";
import "./styles.css";
import Navbar from "./components/Navbar";


export default function App() {
  return (
    <>
      <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/tv/:id" element={<TVDetailPage />} />
    </Routes>
    </> 
  );
}
