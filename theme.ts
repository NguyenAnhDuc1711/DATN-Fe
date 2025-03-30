import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props: Record<string, any>) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#fafafa", "#0a0a0a")(props),
    },
  }),
};
// _hover={{ bg: colorMode === "dark" ? "#171717" : "#f0f0f0" }}
// bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
// color={colorMode === "dark" ? "#b8b8b8" : "#ffffff"}
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#0a0a0a",
  },
  cbg: {
    light: "#fafafa",
    dark: "#181818",
  },
  cuse: {
    light: "#ffffff",
    dark: "#202020",
  },
  ccl: {
    light: "#f3f5f7",
    dark: "#000000",
  },
};

const theme = extendTheme({
  config,
  styles,
  colors,
});

export default theme;
