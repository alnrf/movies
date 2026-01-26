import { useState } from "react";
import ActorModal from "./ActorModal";
import { getProfileUrl } from "../utils/tmdbImage";
import { Card, CardBody } from "@chakra-ui/react/card";
import { Heading, Image, Stack, Text } from "@chakra-ui/react";

interface Props {
  actor: any;
  launchYear: number;
}

export default function CastCard({ actor, launchYear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <>
        <Card
          maxW="sm"
          transition="transform 0.15s ease, box-shadow 0.15s ease"
          onClick={() => setOpen(true)}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardBody>
            <Image
              src={getProfileUrl(actor.profile_path, "SMALL")}
              alt={actor.name}
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="sm" mt="2">
                {actor.name}
              </Heading>
              <Text>{actor.character || actor.roles?.[0]?.character}</Text>
            </Stack>
          </CardBody>
        </Card>
      </>

      {open && (
        <ActorModal
          actorId={actor.id}
          launchYear={launchYear}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
