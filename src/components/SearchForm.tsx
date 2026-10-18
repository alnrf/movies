import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  RadioGroup,
  Radio,
  Button,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import type { SearchType } from "../types/SearchType";
import { SEARCH_TYPES, SEARCH_TYPE_LABELS } from "../utils/searchType";

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
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 3, md: 5 }}
      >
        {/* INPUT */}
        <InputGroup flex="1" minW={0}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>

          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Pesquisar..."
            bg="white"
            borderRadius="full"
            pr={query ? "2.5rem" : undefined}
          />
          {query && (
            <InputRightElement>
              <IconButton
                aria-label="Limpar busca"
                icon={<CloseIcon boxSize={2.5} />}
                size="xs"
                variant="ghost"
                isRound
                onClick={() => onQueryChange("")}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* RADIOS */}
        <RadioGroup
          value={type}
          onChange={(value) => onTypeChange(value as SearchType)}
          colorScheme="red"
        >
          <Stack direction="row" spacing={4}>
            {SEARCH_TYPES.map((t) => (
              <Radio key={t} value={t}>
                {SEARCH_TYPE_LABELS[t]}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>

        {/* BUTTON */}
        <Button type="submit" colorScheme="red" borderRadius="full" px={8} flexShrink={0}>
          Buscar
        </Button>
      </Flex>
    </form>
  );
}
