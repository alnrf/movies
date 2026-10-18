import { Link as RouterLink, useLocation, useSearchParams } from "react-router-dom";
import { Box, Flex, Heading, Icon, Link, Stack, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { MdHome, MdMovie, MdPerson, MdTv } from "react-icons/md";
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

/** Conteúdo da barra lateral: usado na versão fixa (desktop) e no menu deslizante (celular). */
export default function Sidebar() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const searchType = parseSearchType(params.get("type"));

  return (
    <Flex direction="column" h="100%" px={6} py={8}>
      <Heading as="p" size="md" mb={10} letterSpacing="tight">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          Movie Search
          <Text as="span" color="red.500">
            .
          </Text>
        </Link>
      </Heading>

      <Text fontSize="xs" color="gray.400" mb={3}>
        Menu
      </Text>

      <Box as="nav" aria-label="Menu principal">
        <Stack as="ul" listStyleType="none" spacing={1}>
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname, searchType);
            return (
              <Box as="li" key={item.label} position="relative">
                {active && (
                  <Box
                    position="absolute"
                    left={-6}
                    top={2}
                    bottom={2}
                    w="3px"
                    borderRightRadius="full"
                    bg="red.500"
                  />
                )}
                <Link
                  as={RouterLink}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight={active ? "semibold" : "normal"}
                  color={active ? "gray.900" : "gray.500"}
                  _hover={{ textDecoration: "none", bg: "gray.50", color: "gray.900" }}
                >
                  <Icon as={item.icon} boxSize={5} color={active ? "red.500" : "inherit"} />
                  {item.label}
                </Link>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Flex>
  );
}
