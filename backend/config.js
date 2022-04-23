var config = {};
config.dataTypes = ["current", "voltage", "power", "temp"];
config.policyTypes = ["simple", "average"];
config.availablePolicyPeriods = ["1 min", "5 min", "10 min"];
config.availableGraphPeriods = ["10 s", "30 s", "1 min", "5 min"];
config.comparisons = [">", "<"]
config.chartConfig = {"xMax" : 300,         
	"xIncrement" : 10,
	"width" : 1000,
	"height" : 400};
config.period2seconds = {"10 s": 10, "30 s":30, "1 min":60, "5 min":300};

module.exports = config;