const net = require("net");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const CLIENT_TO_MIDDLE_PORT = 49160;
const MIDDLE_TO_FRONT_PORT = 3001;

const app = express();
const C2M_server = net.createServer();
const M2F_server = require('http').createServer(app);
const M2F_socket = require('socket.io')(M2F_server,{cors:{origin: true, credentials: true}});

const config = require("./config");
const crud = require("./services/crud");
const alerts = require("./services/alerts");
const parseData = require('./utils/parseData');
const createEmptyGraph = require('./utils/createEmptyGraph');
const computeHealthStatuses = require('./utils/computeHealthStatuses');
const formatPolicies = require('./utils/formatPolicies');
const getSampleRate = require("./utils/getSampleRate");
const formatHealthStatuses = require("./utils/formatHealthStatuses");


let addons = [];      // backend local array to manage addon ids
let pkt_buffer = [];

let coordinates = {};
let statuses = [];

let active_policies = [];
let active_pid = null;
let active_period = 30;
let active_phone = '857-258-3654';

let prevTime = Date.now();

app.use(cors());
app.use(express.json());

app.route("/policy")
  .post((req, res) => {
    policy = req.body;

    if (Object.values(policy).includes("")){
      res.status(400).send("Field must not be empty");
    }
    else if (isNaN(policy.threshold)){
      res.status(400).send("Threshold must be a number");
    }
    else{
      crud.insertNewPolicy(active_pid, policy);
      active_policies = crud.getPolicies(active_pid);
      M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
      res.sendStatus(200);
    }
  })
  .delete((req, res) => {
    policy_id = req.body.id;
    crud.deletePolicy(active_pid, policy_id);
    active_policies = crud.getPolicies(active_pid);
    M2F_socket.emit("updatePolicies", formatPolicies(active_policies));
    res.sendStatus(200);
  });

app.post("/addon", (req, res) => {
  pid = req.body.addon.toString();
  active_pid = pid;
  res.sendStatus(200);
});

app.post("/chart_period", (req, res) => {
  period = req.body.period;
  active_period = period;
  res.sendStatus(200);
})

app.get("/chart_periods", (req, res) => {
  res.send(config.availableGraphPeriods);
});

app.get("/chart_config", (req, res) => {
  res.send(config.chartConfig);
})

app.get("/policy_modal", (req, res) => {
  let setup = {policyTypes: config.policyTypes, 
    periods: config.availablePolicyPeriods,
    comparisons: config.comparisons,
    dataTypes: config.chartTypes,
  }
  res.send(setup);
})

app.get("/data_types", (req, res) => {
  try {
    res.send(Object.keys(coordinates[active_pid])) 
  } catch (error) {
    res.send([]);
  }
}); 

M2F_socket.on("connection", M2F_connectionHandler);
M2F_server.listen(MIDDLE_TO_FRONT_PORT, () => {console.log(`M2F_server listening on ${MIDDLE_TO_FRONT_PORT}`)});

C2M_server.on('connection', C2M_connectionHandler);
C2M_server.listen(CLIENT_TO_MIDDLE_PORT, C2M_serverHandler);


function C2M_serverHandler() {
  console.log(`C2M_server listening on ${CLIENT_TO_MIDDLE_PORT}`);

  setInterval(()=>{
    crud.insertMany(pkt_buffer);
    pkt_buffer.length = 0;
  }, 1000);

}

function M2F_connectionHandler(client){
  client.on("disconnect", () => {
    active_pid = null;
    active_period = null;
    active_policies = [];
  });

  setInterval(() => {
      statuses = computeHealthStatuses(coordinates, crud.getAllPolicies());
      statuses.forEach(status_obj => {
        if (status_obj.status != 'HEALTHY') {
          message = `WARNING: SENSING MODULE ID ${status_obj.id} - STATUS: ${status_obj.status}`
          alerts.sendMessage(message, active_phone);
        }
      });

      M2F_socket.emit("updateAddons", addons.map(a => a.id));
      M2F_socket.emit("updateStatuses", formatHealthStatuses(statuses));
    if (active_pid != null) {
      M2F_socket.emit("updateCoords", coordinates[active_pid]);
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

        coordinates[pkt.id] = createEmptyGraph(config.chartTypes, config.chartConfig); // init coords matrix for addon
        conn.write(Buffer.from([0x01]));  // send ACK byte
      } 
      if (("data" in pkt) && (pkt.id in coordinates)) {
        pkt_buffer.push(pkt);
        if (Date.now() - prevTime >= getSampleRate(active_period, config.chartConfig.xMax) * 0.8) {
          //console.log(Date.now() - prevTime);
          for (let i = 0; i < config.chartTypes.length; i++) {
            for (let j = 0; j < config.chartConfig.xMax - 1; j++) {
              coordinates[pkt.id][config.chartTypes[i]][j].y = coordinates[pkt.id][config.chartTypes[i]][j+1].y;
            }
            coordinates[pkt.id][config.chartTypes[i]][config.chartConfig.xMax - 1].y = pkt.data[config.chartTypes[i]];
          }
          prevTime = Date.now();
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
