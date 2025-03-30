// colorModeConfig.js
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// Global styles
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#fafafa")(props),
    },
  }),
};

// Color Mode Config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

// Custom colors
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

// Create the theme
const theme = extendTheme({ config, styles, colors });

export default theme;
