import { ChakraProvider } from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "../languages/i18n";
import theme from "../theme";
import "./animations.css";
import App from "./App";
import "./index.css";
import store from "./store/index";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  );
}
