import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={20} px={6}>
      <Heading size="2xl" mb={2}>
        404
      </Heading>
      <Heading size="lg" mb={4} color="gray.600">
        Página não encontrada
      </Heading>
      <Text color="gray.500" mb={8}>
        A página que você procura não existe ou foi removida.
      </Text>
      <Button colorScheme="teal" onClick={() => navigate("/")}>
        Voltar para a página inicial
      </Button>
    </Box>
  );
}
