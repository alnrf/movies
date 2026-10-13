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
import type { SearchResultItem } from "../types/SearchResult";
import type { SearchType } from "../types/SearchType";

interface Props {
  results: SearchResultItem[];
  type: SearchType;
}

export default function SearchResults({ results, type }: Props) {
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
              alt={title}
              objectFit="cover"
            />
            <Stack>
              <CardBody>
                <Heading size="md">{displayName}</Heading>
              </CardBody>
              <CardFooter>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => {
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
