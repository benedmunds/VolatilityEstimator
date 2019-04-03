'use strict';
const fs = require('fs');
const request = require('request');
const parse = require('csv-parse/lib/sync');
const moment = require('moment-timezone');

module.exports = function(instrument, open, close, n, callback){

  const startDate = moment().tz('America/Chicago').subtract((n*4), 'days');
  const endDate = moment().tz('America/Chicago');

  const url = `https://www.barchart.com/proxies/timeseries/queryminutes.ashx?symbol=${instrument}&interval=1&start=${startDate.format('YYYYMMDD000000')}&end=${endDate.format('YYYYMMDD235959')}&volume=total&order=asc&dividends=false&backadjust=true&daystoexpiration=1&contractroll=combined`;
  
  const options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
      'x-xsrf-token': 'eyJpdiI6IkV1eGxIMFpIMG5SQ2RXS2ZFUDh3OUE9PSIsInZhbHVlIjoiVFJPSG5GS1VRNWJydTBXTmxlQm1PbHFEVlFqN1BVUlczQlJscGpxNkN4UXFNUjlSTmNDa3NuZzR3SktXa3JcL1MiLCJtYWMiOiJiNTk1NDlmOWEzZThlNDgxNjY0NWI5YmQ1MTA5MWQwNzEzYmJiNWZmNDY1NTVmMDM2MDA3NThiOWU1NDIzMjU2In0=',
      'referer': 'https://www.barchart.com/futures/quotes/ESM19/interactive-chart',
      'pragma': 'no-cache',
      'cookie': '_gcl_au=1.1.568989614.1552437983; _ga=GA1.2.339135498.1552437983; __qca=P0-323437103-1552437986692; __gads=ID=21f3580adbf86089:T=1552437987:S=ALNI_MZD5h68qSa5H_ilwKa83y-KYrYOuA; fitracking_12=no; _pxvid=8eb920f0-4529-11e9-b5d6-0242ac120010; __browsiUID=88448e9d-ae89-4d35-a958-04615d3630aa%26%7B%22bt%22%3A%22Browser%22%2C%22os%22%3A%22macOS%22%2C%22osv%22%3A%2210.14.2%22%2C%22m%22%3A%22Macintosh%22%2C%22v%22%3A%22Apple%22%2C%22b%22%3A%22Chrome%22%2C%22p%22%3A2%7D; market=eyJpdiI6IlRPdzVpbHJucjBGbDlkYWh4UmhWaEE9PSIsInZhbHVlIjoiZDg5bllySWZnWXY4QmpKYUpzWFlxdz09IiwibWFjIjoiNDI0MGFjZDcyMjZlNThiNmRlZjM3OTliMDk3YTVhMTcxZWEzMmM3ODRkYzUxNGM1MTdlZmExYTNmNTQyYmY5OSJ9; _gid=GA1.2.2142660350.1554298120; fi_utm=direct%7Cdirect%7C%7C%7C%7C; _gat_UA-2009749-51=1; IC_viewcount_www.barchart.com=4; _awl=3.1554298741.0.4-4da1c280-bc47e886392e2a4ea06dde21fa3f8081-6763652d75732d6561737431-5ca4b775-0; bcInteractiveChartPremierAds=true; XSRF-TOKEN=eyJpdiI6IkV1eGxIMFpIMG5SQ2RXS2ZFUDh3OUE9PSIsInZhbHVlIjoiVFJPSG5GS1VRNWJydTBXTmxlQm1PbHFEVlFqN1BVUlczQlJscGpxNkN4UXFNUjlSTmNDa3NuZzR3SktXa3JcL1MiLCJtYWMiOiJiNTk1NDlmOWEzZThlNDgxNjY0NWI5YmQ1MTA5MWQwNzEzYmJiNWZmNDY1NTVmMDM2MDA3NThiOWU1NDIzMjU2In0%3D; laravel_session=eyJpdiI6IndcL2VDaDJDOEdNK1pPQVNFNWI0Mm1BPT0iLCJ2YWx1ZSI6Ik9Ma3htbzBqamtnZ2g1U21TYnRjNHhRanhyelZEbHNKRm1UdVo1NFNqa05hR01vVGg0T0tMWFhSSVRaRWhBQVciLCJtYWMiOiIyZDI3OTBhOGFiMWVkYTQwM2Q3OGNhZTNmZjEwMDJlYWYyMjI3ZTM4YmMzMzQxZGFkNzRmNGFlMDhjMDAzNDQ2In0%3D'
    }
  };

  const year = moment().format('YYYY');
  const holidays = [
	  `${year}-01-01`,
	  `${year}-04-19`,
	  `${year}-12-05`,
	  `${year}-12-25`
  ];

  request(options, function(err, res, body){

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