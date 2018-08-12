'use strict';
const fs = require('fs');
const request = require('request');
const parse = require('csv-parse/lib/sync');
const moment = require('moment-timezone');

module.exports = function(instrument, open, close, n, callback){

  const startDate = moment().tz('America/Chicago').subtract((n*4), 'days');
  const endDate = moment().tz('America/Chicago');

  const url = `https://www.barchart.com/proxies/timeseries/queryminutes.ashx?symbol=${instrument}&interval=1&start=${startDate.format('YYYYMMDD000000')}&end=${endDate.format('YYYYMMDD235959')}&volume=total&order=asc&dividends=false&backadjust=true&daystoexpiration=1&contractroll=combined`;
  
  const year = moment().format('YYYY');
  const holidays = [
	  `${year}-01-01`,
	  `${year}-01-15`,
	  `${year}-02-19`,
	  `${year}-05-28`,
	  `${year}-07-04`,
	  `${year}-09-03`,
	  `${year}-10-08`,
	  `${year}-11-12`,
	  `${year}-11-22`,
	  `${year}-12-25`
  ];

  request(url, function(err, res, body){

  	let ohlcs = [];

  	try {
	  	//parse response
	  	const data = body.split("\n").map(function(row){
	  		
	  		const parsedRow = row.split(',');
	  		const datetime = parsedRow[0].split(' ');

	  		return {
	  			date: datetime[0],
	  			time: datetime[1],
	  			open: parseFloat(parsedRow[2]),
	  			high: parseFloat(parsedRow[3]),
	  			low: parseFloat(parsedRow[4]),
	  			close: parseFloat(parsedRow[5])
	  		};

	  	}).filter(function(row){
			
			return row.date !== '\r' && row.date !== '';

		}).filter(function(row){

			return holidays.indexOf(row.date) === -1;

		});

	  	//filter for dates
	  	let days = [];
	  	for (let i=0; i<data.length; i++) {

	  		if (days.indexOf(data[i].date) === -1)
	  			days.push(data[i].date);

	  	}

	  	//filter for ohlc
	  	for (let i=0; i<days.length; i++) {

	  		const today = data.filter(function(row){
	  			if (open > close){
	  				if (row.time >= open) {
	  					return row.date === days[i-1];
	  				}
	  				else if (row.time <= close) {
	  					return row.date === days[i];
	  				}
	  				else {
	  					return false;
	  				}
	  			}
	  			else {
	  				return row.date === days[i];
	  			}
	  		});

	  		let ohlc = {}
	  		for (let j=0; j<today.length; j++) {

	  			let hour = today[j];
	  			let activeSession = false;

	  			//RTH
	  			if (hour.time >= open && hour.time <= close && hour.date !== moment().format('YYYY-MM-DD')) {
 					activeSession = true;
	  			}

	  			//ETH
	  			if (open > close && (hour.time >= open && hour.date !== moment().format('YYYY-MM-DD') || hour.time <= close)) {
					activeSession = true;
	  			}

	  			if (activeSession) {

					//initial since we might not have the exact open time
		  			if (typeof ohlc.open === 'undefined') {
		  				ohlc = hour;
		  				delete ohlc.time;
		  				delete ohlc.date;
		  			}

		  			//open
		  			if (hour.time == open) {
		  				ohlc.open = hour.open;
		  			}

		  			//close
		  			if (hour.time == close) {
		  				ohlc.close = hour.close;
		  				ohlc.date = hour.date;
		  			}
		  			
		  			//high
		  			if (hour.high > ohlc.high) {
		  				ohlc.high = hour.high;
		  			}
		  			
		  			//low
		  			if (hour.low < ohlc.low) {
		  				ohlc.low = hour.low;
		  			}

		  		}

	  		};

	  		if (typeof ohlc.date !== 'undefined') {
	  			ohlcs.push(ohlc);
	  		}


	  	}

	  	ohlcs = ohlcs.reverse().slice(0, (n*2)).reverse();

	  	callback(ohlcs);
	 }
	 catch(e){}

  });

};