import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={20} px={6}>
          <Heading size="xl" mb={4}>
            Algo deu errado
          </Heading>
          <Text color="gray.600" mb={6}>
            {this.state.error?.message ?? "Erro inesperado. Tente novamente."}
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => (window.location.href = "/")}
          >
            Voltar para a página inicial
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
