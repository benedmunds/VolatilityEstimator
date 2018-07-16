'use strict';

//Bootstrap
const fs = require('fs');
const moment = require('moment-timezone');
const data = require('./lib/data.js');
const stats = require('./lib/stats.js');
const view = require('./lib/view.js');
const email = require('./lib/email.js');
const c2c = require('./models/c2c.js');
const yz = require('./models/yangZhang.js');

//Config
const instrument = process.argv[2];
const tickSize = process.argv[3];
const open = process.argv[4];
const close = process.argv[5]
const period = parseInt(process.argv[6]);
const recipients = process.argv[7];

//Pull Data and Process
data(instrument, open, close, period, function(source){

	//Build out the data models
	const c2cData = [...source];
	const close2CloseModel = c2c(period, c2cData, stats);
	const c2cOutput = view.markdown(instrument, tickSize, c2cData[0].date, period, c2cData[0].close, 'Close-to-Close', close2CloseModel);
	const c2cHtml = view.html(instrument, tickSize, c2cData[0].date, period, c2cData[0].close, 'Close-to-Close', close2CloseModel);

	const yzData = [...source];
	const yangZhangModel = yz(period, yzData, stats);
	const yzOutput = view.markdown(instrument, tickSize, yzData[0].date, period, yzData[0].close, 'Yang Zhang', yangZhangModel);
	const yzHtml = view.html(instrument, tickSize, yzData[0].date, period, yzData[0].close, 'Yang Zhang', yangZhangModel);

	//Format Output
	const markdown = `## ${instrument}
		${c2cOutput}
		${yzOutput}
	`;
	const html = `<h2>${instrument}</h2>
		${c2cHtml}
		${yzHtml}
	`;

	//Write output to output file and to the console
	fs.writeFileSync(`output/${instrument.replace(/\W/g,'')}.md`, markdown);
	console.log(markdown);

	//Email Report
	if (recipients) {
		email(recipients, `${instrument} Volatility Report for ${moment().format('YYYY-MM-DD')}`, html);
	}

});