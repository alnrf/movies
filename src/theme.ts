import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  // Tema claro por padrão; a escolha do usuário fica salva no localStorage pelo Chakra.
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      "bg.canvas": { default: "gray.50", _dark: "gray.900" },
      "bg.surface": { default: "white", _dark: "gray.800" },
      "bg.hover": { default: "gray.50", _dark: "whiteAlpha.100" },
      "border.subtle": { default: "gray.100", _dark: "whiteAlpha.100" },
      "text.primary": { default: "gray.900", _dark: "whiteAlpha.900" },
      "text.secondary": { default: "gray.600", _dark: "gray.300" },
      "text.muted": { default: "gray.500", _dark: "gray.400" },
      "text.subtle": { default: "gray.400", _dark: "gray.500" },
    },
  },
  styles: {
    global: {
      body: { bg: "bg.canvas" },
    },
  },
});
