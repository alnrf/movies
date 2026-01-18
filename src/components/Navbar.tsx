import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.pathname !== "/";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1
          className="navbar-title"
          onClick={canGoBack ? () => navigate("/") : undefined}
          aria-label="Home"
          style={canGoBack ? { cursor: "pointer" } : { cursor: "none" }}
        >
          MovieSearch
        </h1>
      </div>

      <div className="navbar-right">
        {canGoBack && (
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            ← Voltar
          </button>
        )}
      </div>
    </header>
  );
}
