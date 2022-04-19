const net = require("net");
const FFT = require('fft.js');
const app = require("express")();
const cors = require("cors");


const CLIENT_TO_MIDDLE_PORT = 49160;
const MIDDLE_TO_FRONT_PORT = 3001;

const C2M_server = net.createServer();
const M2F_server = require('http').createServer(app);
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

const config = require("./config");
const crud = require("./services/crud");
const parseData = require('./utils/parseData');
const createEmptyGraph = require('./utils/createEmptyGraph');
const computeHealthStatuses = require('./utils/computeHealthStatuses');
const formatPolicies = require('./utils/formatPolicies');

const fft = new FFT(512);
const out = fft.createComplexArray();

let addons = [];      // backend local array to manage addon ids
let pkt_buffer = [];
let cur = Date.now();

const chart_types = ["current", "power", "temp"];
const thresholds = {"current": 100, "power": 60, "temp": 80};

let active_pid = null;
let coordinates = {};
let active_policies = [];

app.use(cors());

app.get("/chart_periods", (req, res) => {
  res.send(config.availableGraphPeriods);
});

app.get("/chart_config", (req,res) => {
  res.send(config.chartConfig);
})

app.get("/policy_modal", (req, res) => {
  let setup = {policyTypes: config.policyTypes, 
    periods: config.availablePolicyPeriods,
    comparisons: config.comparisons,
    dataTypes: Object.keys(coordinates[active_pid])
  }
  res.send(setup);
})

app.get("/data_types", (req,res) => {
  try {
    res.send(Object.keys(coordinates[active_pid])) 
  } catch (error) {
    res.send([]);
  }
}); 

M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`M2F_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
C2M_server.listen(CLIENT_TO_MIDDLE_PORT, () => {console.log(`C2M_server listening on ${CLIENT_TO_MIDDLE_PORT}`)});


function C2M_serverHandler() {
  console.log(`C2M_server listening on ${CLIENT_TO_MIDDLE_PORT}`);

  setInterval(()=>{
    cur = Date.now();
    crud.insertMany(pkt_buffer);
    console.log(pkt_buffer.length, Date.now()-cur);
    cur = Date.now();
    
    pkt_buffer.length = 0;
  }, 1000);
  /*
  setInterval(() => {
    prevTime = Date.now()-5000;
    curTime = Date.now();
    input = crud.getAccelData('z', prevTime, curTime).map((row) => (row['z']) );
    if (input.length == fft.size) {
      fft.realTransform(out, input);

    }  

  }, 500);*/

}

function M2F_connectionHandler(client){
  M2F_socket.emit("initSetup", config);
  M2F_socket.emit("updateChartConfig", config.chartConfig);

  client.on("addon_selection", (pid) => {
    active_pid = pid.toString();
  })

  client.on("chart_period_selection", (periodAndFrequency) => {
    // Receives label for x axis period as well as the polling frequency associated with it.
    // This will allow us to query the database for the appropriate info, as well as change
    // the frequency at which we poll the incoming data, so we can modify our coordinates array
    // and send it back to the frontend.
    console.log("To be used once we have connected the database:", periodAndFrequency);
  });

  client.on("add_policy", (policy) => {
    crud.insertNewPolicy(active_pid, policy);
    active_policies = crud.getPolicies(active_pid);
    M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
  });

  client.on("delete_policy", (id) => {
    crud.deletePolicy(active_pid, id);
    active_policies = crud.getPolicies(active_pid);
    M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
  });

  setInterval(() => {
      M2F_socket.emit("updateAddons", addons.map(a => a.id));
      M2F_socket.emit("updateStatuses", computeHealthStatuses(coordinates, crud.getAllPolicies()));
    if (active_pid != null) {
      M2F_socket.emit("updateCoords", coordinates[active_pid]);
      //M2F_socket.emit("updateStatuses", [{id:'123', status:'healthy'}]);
      //console.log(formatPolicies(crud.getPolicies(active_pid)));
      M2F_socket.emit("updatePolicies", formatPolicies(crud.getPolicies(active_pid)));
    }
  }, 100);

}

// The function should also add something like { id: <some number>, data: <some number> } to the addons array
function C2M_connectionHandler(conn){
  conn.setNoDelay(true);
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  conn.setTimeout(5000, function(){
    conn.destroy();
  });

  conn.on('error', (err) => {console.log('Connection %s error: %s', remoteAddress, err.message)});

  conn.on('data', (recv_d) => {
    let data = parseData(recv_d)    // parse buffer stream into individual packets of data and place into data array
    for (let pkt of data) { 
      if (!addons.some(addon => addon.id === pkt.id)) {
        pkt["remotePort"] = conn.remotePort;
        addons.push(pkt);
        console.log(addons);

        coordinates[pkt.id] = createEmptyGraph(chart_types, config.chartConfig, thresholds); // init coords matrix for addon
        conn.write(Buffer.from([0x01]));  // send ACK byte
      } 
      if (("data" in pkt) && (pkt.id in coordinates)) {
        pkt_buffer.push(pkt);
        for (let i = 0; i < chart_types.length; i++) {
          for (let j = 0; j < config.chartConfig.xMax - 1; j++) {
            coordinates[pkt.id][chart_types[i]][j].y = coordinates[pkt.id][chart_types[i]][j+1].y;
          }
          coordinates[pkt.id][chart_types[i]][config.chartConfig.xMax - 1].y = pkt.data[chart_types[i]];
        }
      }
    }
  });

  conn.on('close', () => {
    // remove connection from addon array
    addon_index = addons.findIndex(addon => addon.remotePort == conn.remotePort);
    addon_id = addons[addon_index].id;
    crud.deleteAllPoliciesForModule(addon_id);
    active_policies = crud.getPolicies(active_pid);
    M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
    addons.splice(addon_index, 1);

    console.log('connection from %s closed', conn.remotePort);
    // remove coordinate matrix for addon
    delete coordinates[addon_id];
  });
}
