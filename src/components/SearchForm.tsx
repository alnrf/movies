import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  RadioGroup,
  Radio,
  Button,
  Stack,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
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
          pr={query ? "2.5rem" : undefined}
        />
        {query && (
          <InputRightElement>
            <IconButton
              aria-label="Limpar busca"
              icon={<CloseIcon boxSize={2.5} />}
              size="xs"
              variant="ghost"
              onClick={() => onQueryChange("")}
            />
          </InputRightElement>
        )}
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
