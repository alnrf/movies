import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActorModal from "./ActorModal";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import { getPosterUrl } from "../utils/tmdbImage";
import { addRecentItem } from "../utils/searchStorage";
import type { SearchResultItem } from "../types/SearchResult";
import type { SearchType } from "../types/SearchType";

interface Props {
  results: SearchResultItem[];
  type: SearchType;
  /** Quando verdadeiro, o item aberto entra em "Buscas recentes". */
  recordRecent?: boolean;
}

export default function SearchResults({ results, type, recordRecent = false }: Props) {
  const navigate = useNavigate();
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  return (
    <>
      <>
        {results.map((item) => {
          const posterPath =
            "poster_path" in item ? item.poster_path : item.profile_path;
          const title =
            "original_title" in item
              ? item.original_title
              : "original_name" in item
                ? item.original_name
                : item.name;
          const displayName = "title" in item ? item.title : item.name;

          return (
          <Card
            key={item.id}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            marginTop="2"
          >
            <Image
              src={getPosterUrl(posterPath, "XSMALL")}
              srcSet={
                posterPath
                  ? `${getPosterUrl(posterPath, "XSMALL")} 92w, ${getPosterUrl(posterPath, "SMALL")} 200w, ${getPosterUrl(posterPath, "MEDIUM")} 300w, ${getPosterUrl(posterPath, "LARGE")} 500w`
                  : undefined
              }
              sizes="(min-width: 30em) 92px, 50vw"
              alt={title}
              objectFit="cover"
              w={{ base: "50%", sm: "92px" }}
              alignSelf={{ base: "center", sm: "auto" }}
              mt={{ base: "4", sm: "0" }}
            />
            <Stack>
              <CardBody>
                <Heading size="md">{displayName}</Heading>
              </CardBody>
              <CardFooter>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  w={{ base: "full", sm: "auto" }}
                  onClick={() => {
                    if (recordRecent) {
                      addRecentItem({ id: item.id, type, name: displayName, imagePath: posterPath });
                    }
                    if (type === "person") {
                      setSelectedActor(item.id);
                    } else {
                      navigate(`/${type}/${item.id}`);
                    }
                  }}
                >
                  Detalhes
                </Button>
              </CardFooter>
            </Stack>
          </Card>
          );
        })}
      </>

      {selectedActor !== null && (
        <ActorModal
          actorId={selectedActor}
          open={true}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </>
  );
}
