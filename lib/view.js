'use strict';
const stats = require('./stats.js');

module.exports = {

	markdown: function(instrument, date, n, close, modelName, model){

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
| Method      | ${modelName.padEnd(14, ' ')} |  3 Sigma UP   |  ${stats.display(sigmas.threeUp)} |
| Latest Data | ${date}     |  2 Sigma UP   |  ${stats.display(sigmas.twoUp)} |
| Periods     | ${n}             |  1 Sigma UP   |  ${stats.display(sigmas.oneUp)} |
| Last Close  | ${stats.display(close)}        |  Volatility   |   ${(model.vol).toFixed(2).padStart(5).padEnd(6, ' ')} |
|             |                |  1 Sigma Vol  |   ${stats.display(sigmas.oneUp - close)}  |
|             |                | 1 Sigma DOWN  |  ${stats.display(sigmas.oneDown)} |
|             |                | 2 Sigma DOWN  |  ${stats.display(sigmas.twoDown)} |
|             |                | 3 Sigma DOWN  |  ${stats.display(sigmas.threeDown)} |
`;

	},

	html: function(instrument, date, n, close, modelName, model){

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
			<td>${stats.display(sigmas.threeUp)}</td>
		</tr>

		<tr>
			<td>Latest Data</td>
			<td>${date}</td>
			<td></td>
			<td>2 Sigma UP</td>
			<td>${stats.display(sigmas.twoUp)}</td>
		</tr>

		<tr>
			<td>Periods</td>
			<td>${n}</td>
			<td></td>
			<td>1 Sigma UP</td>
			<td>${stats.display(sigmas.oneUp)}</td>
		</tr>

		<tr>
			<td>Last Close</td>
			<td>${stats.display(close)}</td>
			<td></td>
			<td>Volatility</td>
			<td>${(model.vol).toFixed(2)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>1 Sigma Vol</td>
			<td>${stats.display(sigmas.oneUp - close)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>1 Sigma DOWN</td>
			<td>${stats.display(sigmas.oneDown)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>2 Sigma DOWN</td>
			<td>${stats.display(sigmas.twoDown)}</td>
		</tr>

		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td>3 Sigma DOWN</td>
			<td>${stats.display(sigmas.threeDown)}</td>
		</tr>

	</tbody>

</table>
`;

	}

};