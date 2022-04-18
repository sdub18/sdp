var config = {};

config.policyTypes = ["simple", "average"];
config.availablePolicyPeriods = ["1 min", "5 min", "10 min"];
config.availableGraphPeriods = ["5 s", "10 s", "30 s", "1 min", "5 min"];
config.comparisons = [">", "<"]
config.chartConfig = {"xMax" : 300,         
	"xIncrement" : 100,
	"width" : 700,
	"height" : 400};


module.exports = config;