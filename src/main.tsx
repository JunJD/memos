import { CssVarsProvider } from "@mui/joy";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import App from "./App";
import theme from "./theme";
import "./helpers/polyfill";
import "./i18n";
import "./less/code-highlight.less";
import "./css/global.css";
import "./css/tailwind.css";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <CssVarsProvider theme={theme}>
        <App />
      </CssVarsProvider>
    </PersistGate>
  </Provider>
);
