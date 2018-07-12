'use strict';
const stats = require('./stats.js');

module.exports = function(instrument, date, n, close, modelName, model){

	const sigmas = {
	    threeUp: close + ((model.mean + model.stdDev) * 3),
	    twoUp: close + ((model.mean + model.stdDev) * 2),
	    oneUp: close + (model.mean + model.stdDev),
	    oneDown: close - (model.mean + model.stdDev),
	    twoDown: close - ((model.mean + model.stdDev) * 2),
	    threeDown: close - ((model.mean + model.stdDev) * 3),
	};

	return `
### ${modelName}

| ${instrument}         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | ${modelName.padEnd(14, ' ')} |  3 Sigma UP   |  ${stats.display(sigmas.threeUp)} |
| Latest Data | ${date}      |  2 Sigma UP   |  ${stats.display(sigmas.twoUp)} |
| Periods     | ${n}             |  1 Sigma UP   |  ${stats.display(sigmas.oneUp)} |
| Last Close  | ${stats.display(close)}        |  Volatility   |   ${(model.vol).toFixed(2)}  |
| 1 Sigma Vol | ${stats.display(sigmas.oneUp - close)}          | 1 Sigma DOWN  |  ${stats.display(sigmas.oneDown)} |
|             |                | 2 Sigma DOWN  |  ${stats.display(sigmas.twoDown)} |
|             |                | 3 Sigma DOWN  |  ${stats.display(sigmas.threeDown)} |
`;

};