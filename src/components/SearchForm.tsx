import type { SearchType } from "../types/SearchType";

interface Props {
  query: string;
  type: SearchType;
  onQueryChange: (v: string) => void;
  onTypeChange: (v: SearchType) => void;
  onSearch: () => void;
}

export default function SearchForm({
  query,
  type,
  onQueryChange,
  onTypeChange,
  onSearch,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Pesquisar..."
      />

      <div>
        <label>
          <input
            type="radio"
            checked={type === "movie"}
            onChange={() => onTypeChange("movie")}
          />
          Filmes
        </label>

        <label>
          <input
            type="radio"
            checked={type === "tv"}
            onChange={() => onTypeChange("tv")}
          />
          Seriados
        </label>

        <label>
          <input
            type="radio"
            checked={type === "person"}
            onChange={() => onTypeChange("person")}
          />
          Atores
        </label>
      </div>

      <button type="submit">Buscar</button>
    </form>
  );
}
