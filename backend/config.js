var config = {};

config.C2M_PORT = 49160;
config.M2F_PORT = 3001;

config.policyTypes = ["simple", "average"];
config.availablePolicyPeriods = ["1 min", "5 min", "10 min"];
config.availableGraphPeriods = ["5 s", "10 s", "30 s", "1 min", "5 min"];
config.chartConfig = {"xMax" : 300,         
"xIncrement" : 100,
"width" : 700,
"height" : 400};


module.exports = config;