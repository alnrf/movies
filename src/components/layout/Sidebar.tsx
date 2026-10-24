import type { ReactNode } from "react";
import { Link as RouterLink, useLocation, useSearchParams } from "react-router-dom";
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  Tooltip,
  VisuallyHidden,
  chakra,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";
import {
  MdDarkMode,
  MdHome,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdLightMode,
  MdMovie,
  MdPerson,
  MdTv,
} from "react-icons/md";
import logo from "../../assets/MovieTVSearch.png";
import logoMini from "../../assets/MovieTVSearchMini.png";
import { parseSearchType } from "../../utils/searchType";
import type { SearchType } from "../../types/SearchType";

interface NavItem {
  label: string;
  icon: IconType;
  to: string;
  isActive: (pathname: string, searchType: SearchType) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    icon: MdHome,
    to: "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "Filmes",
    icon: MdMovie,
    to: "/search?type=movie",
    isActive: (pathname, type) =>
      (pathname === "/search" && type === "movie") || pathname.startsWith("/movie/"),
  },
  {
    label: "Séries",
    icon: MdTv,
    to: "/search?type=tv",
    isActive: (pathname, type) =>
      (pathname === "/search" && type === "tv") || pathname.startsWith("/tv/"),
  },
  {
    label: "Atores",
    icon: MdPerson,
    to: "/search?type=person",
    isActive: (pathname, type) => pathname === "/search" && type === "person",
  },
];

/** Estilo comum de uma linha do menu (link ou botão). */
const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  w: "100%",
  px: 3,
  py: 2,
  borderRadius: "md",
  _hover: { textDecoration: "none", bg: "bg.hover", color: "text.primary" },
};

/** Rótulo da linha: visível quando expandida, só para leitores de tela quando recolhida. */
function RowLabel({ collapsed, children }: { collapsed: boolean; children: ReactNode }) {
  return collapsed ? <VisuallyHidden>{children}</VisuallyHidden> : <>{children}</>;
}

/** No modo recolhido, mostra o nome do item ao passar o mouse. */
function WithTooltip({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label} placement="right" isDisabled={!collapsed} hasArrow>
      <Box>{children}</Box>
    </Tooltip>
  );
}

interface Props {
  /** Mostra só os ícones. */
  collapsed?: boolean;
  /** Quando informado, exibe o botão de recolher/expandir. */
  onToggleCollapse?: () => void;
}

/** Conteúdo da barra lateral: usado na versão fixa (desktop) e no menu deslizante (celular). */
export default function Sidebar({ collapsed = false, onToggleCollapse }: Props) {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const searchType = parseSearchType(params.get("type"));
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // O texto do logo é roxo escuro: no tema escuro, um fundo claro mantém a leitura.
  const logoBg = useColorModeValue("transparent", "whiteAlpha.900");

  const themeLabel = isDark ? "Tema claro" : "Tema escuro";
  const collapseLabel = collapsed ? "Expandir menu" : "Recolher menu";

  return (
    <Flex direction="column" h="100%" px={collapsed ? 3 : 6} py={8}>
      <Link
        as={RouterLink}
        to="/"
        display="block"
        mb={collapsed ? 8 : 6}
        mx={collapsed ? "auto" : 0}
        bg={collapsed ? "transparent" : logoBg}
        borderRadius="lg"
        p={collapsed ? 0 : isDark ? 2 : 0}
      >
        <Image
          src={collapsed ? logoMini : logo}
          alt="Movie & TV Search"
          w={collapsed ? "44px" : "100%"}
          maxW="190px"
        />
      </Link>

      {!collapsed && (
        <Text fontSize="xs" color="text.subtle" mb={3}>
          Menu
        </Text>
      )}

      <Box as="nav" aria-label="Menu principal">
        <Stack as="ul" listStyleType="none" spacing={1}>
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname, searchType);
            return (
              <Box as="li" key={item.label} position="relative">
                {active && (
                  <Box
                    position="absolute"
                    left={collapsed ? -3 : -6}
                    top={2}
                    bottom={2}
                    w="3px"
                    borderRightRadius="full"
                    bg="red.500"
                  />
                )}
                <WithTooltip collapsed={collapsed} label={item.label}>
                  <Link
                    as={RouterLink}
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    {...rowStyle}
                    justifyContent={collapsed ? "center" : "flex-start"}
                    fontWeight={active ? "semibold" : "normal"}
                    color={active ? "text.primary" : "text.muted"}
                  >
                    <Icon as={item.icon} boxSize={5} color={active ? "red.500" : "inherit"} />
                    <RowLabel collapsed={collapsed}>{item.label}</RowLabel>
                  </Link>
                </WithTooltip>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* RODAPÉ: tema e recolher */}
      <Stack spacing={1} mt="auto" pt={6} borderTopWidth="1px" borderColor="border.subtle">
        <WithTooltip collapsed={collapsed} label={themeLabel}>
          <chakra.button
            type="button"
            onClick={toggleColorMode}
            aria-label={themeLabel}
            {...rowStyle}
            justifyContent={collapsed ? "center" : "flex-start"}
            color="text.muted"
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize={5} />
            <RowLabel collapsed={collapsed}>{themeLabel}</RowLabel>
          </chakra.button>
        </WithTooltip>

        {onToggleCollapse && (
          <WithTooltip collapsed={collapsed} label={collapseLabel}>
            <chakra.button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapseLabel}
              aria-expanded={!collapsed}
              {...rowStyle}
              justifyContent={collapsed ? "center" : "flex-start"}
              color="text.muted"
            >
              <Icon
                as={collapsed ? MdKeyboardDoubleArrowRight : MdKeyboardDoubleArrowLeft}
                boxSize={5}
              />
              <RowLabel collapsed={collapsed}>{collapseLabel}</RowLabel>
            </chakra.button>
          </WithTooltip>
        )}
      </Stack>
    </Flex>
  );
}
