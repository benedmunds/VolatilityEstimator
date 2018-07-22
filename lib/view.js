'use strict';
const stats = require('./stats.js');

module.exports = {

	aggregateText: function(instrument, tickSize, date, n, open, close, lastClose, c2cModel, yzModel){

		const c2cSigmas = {
		    threeUp: lastClose + ((c2cModel.mean + c2cModel.stdDev) * 3),
		    twoUp: lastClose + ((c2cModel.mean + c2cModel.stdDev) * 2),
		    oneUp: lastClose + (c2cModel.mean + c2cModel.stdDev),
		    oneDown: lastClose - (c2cModel.mean + c2cModel.stdDev),
		    twoDown: lastClose - ((c2cModel.mean + c2cModel.stdDev) * 2),
		    threeDown: lastClose - ((c2cModel.mean + c2cModel.stdDev) * 3),
		};

		const yzSigmas = {
		    threeUp: lastClose + ((yzModel.mean + yzModel.stdDev) * 3),
		    twoUp: lastClose + ((yzModel.mean + yzModel.stdDev) * 2),
		    oneUp: lastClose + (yzModel.mean + yzModel.stdDev),
		    oneDown: lastClose - (yzModel.mean + yzModel.stdDev),
		    twoDown: lastClose - ((yzModel.mean + yzModel.stdDev) * 2),
		    threeDown: lastClose - ((yzModel.mean + yzModel.stdDev) * 3),
		};


		return `
[Sigma]: *[Close-to-Close]* | [Yang-Zhang]
3 sigma UP: *${stats.display(c2cSigmas.threeUp, tickSize)}* | ${stats.display(yzSigmas.threeUp, tickSize)}
2 sigma UP: *${stats.display(c2cSigmas.twoUp, tickSize)}* | ${stats.display(yzSigmas.twoUp, tickSize)}
1 sigma UP: *${stats.display(c2cSigmas.oneUp, tickSize)}* | ${stats.display(yzSigmas.oneUp, tickSize)}
---------
Last Close: ${stats.display(lastClose, tickSize)} on ${date}
---------
1 sigma DOWN: *${stats.display(c2cSigmas.oneDown, tickSize)}* | ${stats.display(yzSigmas.oneDown, tickSize)}
2 sigma DOWN: *${stats.display(c2cSigmas.twoDown, tickSize)}* | ${stats.display(yzSigmas.twoDown, tickSize)}
3 sigma DOWN: *${stats.display(c2cSigmas.threeDown, tickSize)}* | ${stats.display(yzSigmas.threeDown, tickSize)}
`;

	},

	markdown: function(instrument, tickSize, date, n, close, modelName, model){

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

| ${instrument.padEnd(11, ' ')} |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | ${modelName.padEnd(14, ' ')} |  3 Sigma UP   |  ${stats.display(sigmas.threeUp, tickSize).padEnd(7, ' ')} |
| Latest Data | ${date}     |  2 Sigma UP   |  ${stats.display(sigmas.twoUp, tickSize).padEnd(7, ' ')} |
| Periods     | ${n}             |  1 Sigma UP   |  ${stats.display(sigmas.oneUp, tickSize).padEnd(7, ' ')} |
| Last Close  | ${stats.display(close, tickSize).padEnd(7, ' ')}        |  Volatility   |   ${(model.vol).toFixed(2).padEnd(6, ' ')} |
|             |                |  1 Sigma Vol  |   ${stats.display(sigmas.oneUp - close, tickSize).padEnd(5, ' ')}  |
|             |                | 1 Sigma DOWN  |  ${stats.display(sigmas.oneDown, tickSize).padEnd(7, ' ')} |
|             |                | 2 Sigma DOWN  |  ${stats.display(sigmas.twoDown, tickSize).padEnd(7, ' ')} |
|             |                | 3 Sigma DOWN  |  ${stats.display(sigmas.threeDown, tickSize).padEnd(7, ' ')} |
`;

	},

	html: function(instrument, tickSize, date, n, close, modelName, model){

		const sigmas = {
		    threeUp: close + ((model.mean + model.stdDev) * 3),
		    twoUp: close + ((model.mean + model.stdDev) * 2),
		    oneUp: close + (model.mean + model.stdDev),
		    oneDown: close - (model.mean + model.stdDev),
		    twoDown: close - ((model.mean + model.stdDev) * 2),
		    threeDown: close - ((model.mean + model.stdDev) * 3),
		};

		return `<style>body,table tr{background-color:#fff}table,table tr{padding:0}table tr td,table tr th{border:1px solid #ccc;text-align:left;margin:0;padding:6px 13px}body{font-family:Helvetica,arial,sans-serif;font-size:14px;line-height:1.6;padding-bottom:20px}table tr{border-top:1px solid #ccc;margin:0}table tr:nth-child(2n){background-color:#f8f8f8}table tr th{font-weight:700}table tr td :first-child,table tr th :first-child{margin-top:0}table tr td :last-child,table tr th :last-child{margin-bottom:0}</style>
<h3>${modelName}</h3>

<table cellspacing=0 cellpadding=0>

	<thead>
		<tr>
			<th>${instrument}</th>
			<th></th>
			<th style="width:10px;"></th>
			<th>Stat</th>
			<th>Value</th>
		</tr>
	</thead>

	<tbody>

		<tr>
			<td>Method</td>
			<td>${modelName}</td>
			<td></td>
			<td>3 Sigma UP</td>
			<td>${stats.display(sigmas.threeUp, tickSize)}</td>
		</tr>

		<tr>
			<td>Latest Data</td>
			<td>${date}</td>
			<td></td>
			<td>2 Sigma UP</td>
			<td>${stats.display(sigmas.twoUp, tickSize)}</td>
		</tr>

		<tr>
			<td>Periods</td>
			<td>${n}</td>
			<td></td>
			<td>1 Sigma UP</td>
			<td>${stats.display(sigmas.oneUp, tickSize)}</td>
		</tr>

		<tr>
			<td>Last Close</td>
			<td>${stats.display(close, tickSize)}</td>
			<td></td>
			<td>Volatility</td>
			<td>${(model.vol).toFixed(2)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>1 Sigma Vol</td>
			<td>${stats.display(sigmas.oneUp - close, tickSize)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>1 Sigma DOWN</td>
			<td>${stats.display(sigmas.oneDown, tickSize)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>2 Sigma DOWN</td>
			<td>${stats.display(sigmas.twoDown, tickSize)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>3 Sigma DOWN</td>
			<td>${stats.display(sigmas.threeDown, tickSize)}</td>
		</tr>

	</tbody>

</table>
`;

	}

};