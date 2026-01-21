import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActorModal from "./ActorModal";
import { Card, CardBody, CardFooter } from "@chakra-ui/react/card";
import { Stack } from "@chakra-ui/react/stack";
import { Image } from "@chakra-ui/react/image";
import { Heading } from "@chakra-ui/react/typography";
import { getPosterUrl } from "../utils/tmdbImage";
import { Button } from "@chakra-ui/react/button";

export default function SearchResults({ results, type, launchYear }: any) {
  const navigate = useNavigate();
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  return (
    <>
      <>
        {results.map((item: any) => (
          <Card
            key={item.id}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            marginTop="2"
          >
            <Image
              src={getPosterUrl(
                item.poster_path || item.profile_path,
                "XSMALL",
              )}
              alt={item.original_title || item.original_name || item?.name}
              objectFit="cover"
            />
            <Stack>
              <CardBody>
                <Heading size="md">{item.title || item.name}</Heading>
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
        ))}
      </>

      {selectedActor !== null && (
        <ActorModal
          actorId={selectedActor}
          launchYear={launchYear}
          open={true}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </>
  );
}
