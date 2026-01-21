import {
  Input,
  InputGroup,
  InputLeftElement,
  RadioGroup,
  Radio,
  Button,
  Stack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
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
      {/* INPUT */}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>

        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Pesquisar..."
        />
      </InputGroup>

      {/* RADIOS */}
      <RadioGroup
        value={type}
        onChange={(value) =>
          onTypeChange(value as SearchType)
        }
        mt={4}
      >
        <Stack direction="row" spacing={4}>
          <Radio value="movie">Filmes</Radio>
          <Radio value="tv">Seriados</Radio>
          <Radio value="person">Atores</Radio>
        </Stack>
      </RadioGroup>

      {/* BUTTON */}
      <Button
        type="submit"
        mt={4}
        colorScheme="blue"
        width="100%"
      >
        Buscar
      </Button>
    </form>
  );
}
