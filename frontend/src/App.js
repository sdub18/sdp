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
  const [coords, setCoords] = React.useState([]);
  const [addons, setAddons] = React.useState([]);
  const [selectedAddon, setSelectedAddon] = React.useState("");
  const [selectedPeriod, setSelectedPeriod] = React.useState("");
  const [config, setConfig] = React.useState({"xMax" : 300,         
  "xIncrement" : 100,
  "width" : 700,
  "height" : 400,
});
  const [processDict_App, setProcessDict] = React.useState({});
  const [threshold, setThreshold] = React.useState(50);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAddons(local_addons);
      setCoords(coordinates);
      setProcessDict(processDict);

    }, RENDER_PERIOD);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!(addons.includes(selectedAddon))){
      setSelectedAddon("");
    }
  }, [addons])

  const chooseAddon = React.useCallback((event) => {
    const addon = event.target.value
    socket.emit("addon_selection", addon);
    setSelectedAddon(Number(addon));
  }, []);

  const choosePeriod = React.useCallback((event) => {
    const period = event.target.value
    let periodAndFrequency = {};
    periodAndFrequency[period] = period_to_frequency[period];
    socket.emit("period_selection", periodAndFrequency);
    setSelectedPeriod(period);
    let tempConfig = globalConfig;
    tempConfig.xMax = period_to_xMax[period];
    tempConfig.xIncrement = period_to_xIncrement[period];
  }, []);

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
