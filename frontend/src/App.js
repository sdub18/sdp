import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";

import { theme } from "./theme";
import { SocketProvider} from "./contexts/SocketContext";
import { ViewProvider } from "./contexts/ViewContext";
import { AddonProvider } from "./contexts/AddonContext";
import Layout from "./layouts/Layout";
import AppContainer from "./containers/AppContainer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <SocketProvider>
        <ViewProvider>
          <AddonProvider>
            <Layout>
              <AppContainer/>
            </Layout>
          </AddonProvider>
        </ViewProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
