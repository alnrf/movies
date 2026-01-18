import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

import "./styles.css";
import Navbar from "./components/Navbar";
import TVDetailPage from "./pages/TVDetailPage";


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
