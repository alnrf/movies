import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import logoMini from "../../assets/MovieTVSearchMini.png";
import { getSidebarCollapsed, saveSidebarCollapsed } from "../../utils/preferences";
import { ChevronLeftIcon, ChevronRightIcon, HamburgerIcon } from "@chakra-ui/icons";
import Sidebar from "./Sidebar";
import SearchForm from "../SearchForm";
import { parseSearchType } from "../../utils/searchType";
import type { SearchType } from "../../types/SearchType";

interface FormState {
  query: string;
  type: SearchType;
}

/**
 * Estado do formulário ditado pela rota: na busca, reflete a URL;
 * na home, volta ao padrão. Nas demais páginas, mantém o que estava.
 */
function formStateFromLocation(pathname: string, params: URLSearchParams): FormState | null {
  if (pathname === "/search") {
    return { query: params.get("query") ?? "", type: parseSearchType(params.get("type")) };
  }
  if (pathname === "/") return { query: "", type: "movie" };
  return null;
}

function PageFallback() {
  return (
    <Box textAlign="center" mt={20}>
      <Spinner size="xl" />
    </Box>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const menu = useDisclosure();
  const [collapsed, setCollapsed] = useState(getSidebarCollapsed);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    saveSidebarCollapsed(next);
  }

  const [form, setForm] = useState<FormState>(
    () => formStateFromLocation(location.pathname, params) ?? { query: "", type: "movie" },
  );

  // Sincroniza o formulário quando a rota muda (ajuste de estado durante o render).
  const [syncedKey, setSyncedKey] = useState(location.key);
  if (syncedKey !== location.key) {
    setSyncedKey(location.key);
    const next = formStateFromLocation(location.pathname, params);
    if (next) setForm(next);
  }

  // Fecha o menu deslizante ao navegar.
  const closeMenu = menu.onClose;
  useEffect(() => {
    closeMenu();
  }, [location.key, closeMenu]);

  // O React Router guarda a posição no histórico em history.state.idx.
  const historyIndex = (window.history.state as { idx?: number } | null)?.idx ?? 0;

  function handleSearch() {
    const query = form.query.trim();
    if (!query) return;
    navigate(`/search?${new URLSearchParams({ query, type: form.type })}`);
  }

  return (
    <Flex minH="100vh" bg="bg.canvas">
      {/* SIDEBAR FIXA (desktop) */}
      <Box
        as="aside"
        display={{ base: "none", lg: "block" }}
        w={collapsed ? "76px" : "240px"}
        transition="width 0.2s ease"
        flexShrink={0}
        position="sticky"
        top={0}
        h="100vh"
        bg="bg.surface"
        borderRightWidth="1px"
        borderColor="border.subtle"
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </Box>

      {/* SIDEBAR DESLIZANTE (celular/tablet) */}
      <Drawer isOpen={menu.isOpen} placement="left" onClose={menu.onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="260px">
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* CONTEÚDO */}
      <Box flex="1" minW={0}>
        <Flex
          as="header"
          px={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 6 }}
          pb={4}
          gap={3}
          align="center"
          wrap="wrap"
        >
          <Flex align="center" gap={1}>
            <IconButton
              aria-label="Abrir menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              display={{ base: "inline-flex", lg: "none" }}
              onClick={menu.onOpen}
            />
            <IconButton
              aria-label="Voltar"
              icon={<ChevronLeftIcon boxSize={6} />}
              variant="ghost"
              isRound
              isDisabled={historyIndex === 0}
              onClick={() => navigate(-1)}
            />
            <IconButton
              aria-label="Avançar"
              icon={<ChevronRightIcon boxSize={6} />}
              variant="ghost"
              isRound
              onClick={() => navigate(1)}
            />
            <Image
              src={logoMini}
              alt="Movie & TV Search"
              display={{ base: "block", lg: "none" }}
              boxSize="32px"
              ml={2}
            />
          </Flex>

          <Box flex="1" minW={{ base: "100%", md: "420px" }}>
            <SearchForm
              query={form.query}
              type={form.type}
              onQueryChange={(query) => setForm((f) => ({ ...f, query }))}
              onTypeChange={(type) => setForm((f) => ({ ...f, type }))}
              onSearch={handleSearch}
            />
          </Box>
        </Flex>

        <Box as="main" px={{ base: 4, md: 8 }} pb={10}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Flex>
  );
}
