import type { ReactNode } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from "@chakra-ui/react";

interface Props {
  title: string;
  children: ReactNode;
  /** Começa aberta (padrão: sim). */
  defaultOpen?: boolean;
}

/** Seção recolhível das páginas de detalhes, com o título no cabeçalho. */
export default function DetailSection({ title, children, defaultOpen = true }: Props) {
  return (
    <Accordion allowToggle defaultIndex={defaultOpen ? [0] : []} mt={6}>
      <AccordionItem borderTopWidth={0} borderBottomWidth="1px" borderColor="border.subtle">
        <Heading as="h3" size="md">
          <AccordionButton
            px={0}
            py={3}
            fontFamily="heading"
            fontWeight="bold"
            fontSize="xl"
            _hover={{ bg: "transparent", color: "red.500" }}
          >
            <Box as="span" flex="1" textAlign="left">
              {title}
            </Box>
            <AccordionIcon boxSize={6} />
          </AccordionButton>
        </Heading>
        <AccordionPanel px={0} pt={2} pb={6}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
