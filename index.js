'use strict';

//Bootstrap
const fs = require('fs');
const moment = require('moment-timezone');
const data = require('./lib/data.js');
const stats = require('./lib/stats.js');
const view = require('./lib/view.js');
const email = require('./lib/email.js');
const chat = require('./lib/rocketchat.js');
const c2c = require('./models/c2c.js');
const yz = require('./models/yangZhang.js');

//Config
const instrument = process.argv[2];
const tickSize = process.argv[3];
const open = process.argv[4];
const close = process.argv[5]
const period = parseInt(process.argv[6]);
const recipients = process.argv[7];
const chatRoom = process.argv[8];

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
Calculated from a ${period} period rolling window of ${open} to ${close} sessions.
${c2cOutput}
${yzOutput}

Data obtained from Barchart.com and is not guaranteed to be accurate.
	`;

	const html = `<h2>${instrument}</h2>
<p>Calculated from a ${period} period rolling window of ${open} to ${close} sessions.</p>
${c2cHtml}
${yzHtml}

<p>Data obtained from Barchart.com and is not guaranteed to be accurate.</p>
	`;

	const text = `*${instrument} - Volatility Report for ${moment().format('YYYY-MM-DD')}* - ${period} period rolling window of ${open} to ${close} sessions
${view.aggregateText(instrument, tickSize, c2cData[0].date, period, open, close, c2cData[0].close, close2CloseModel, yangZhangModel)}
	`;
	console.log(text);

	// Write output to output file and to the console
	fs.writeFileSync(`output/${instrument.replace(/\W/g,'')}.md`, markdown);
	console.log(markdown);

	//Email Report
	if (recipients) {
		email(recipients, `${instrument} Volatility Report for ${moment().format('YYYY-MM-DD')}`, html);
	}

	// Post to RocketChat
	if (process.env.ROCKETCHAT_API_URL && chatRoom) {
		const chatTitle = `${instrument} Volatility Report for ${moment().format('YYYY-MM-DD')}`;

		chat.post(chatRoom, text);
	}

});