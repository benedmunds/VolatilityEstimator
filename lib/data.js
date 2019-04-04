'use strict';
const fs = require('fs');
const request = require('request');
const parse = require('csv-parse/lib/sync');
const moment = require('moment-timezone');
const numberOfRetries = 10;
let retryAttempt = 0;

const getData = function(instrument, open, close, n, callback){

  const startDate = moment().tz('America/Chicago').subtract((n*4), 'days');
  const endDate = moment().tz('America/Chicago');

  //get an active cookie
  request({
  	url: 'https://www.barchart.com/futures/quotes/ESM19/interactive-chart',
  	headers: {
  		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
  		'referer': 'https://www.barchart.com/futures/quotes/ESM19/interactive-chart'
  	}
  }, function(err, res, body){
  	
  	const cookies = res.headers['set-cookie'];
  	const xsrfToken = cookies.find(function(cookie){
    	const [key, val] = cookie.split('=');
    	if (key === 'XSRF-TOKEN') {
    		return true;
    	}
    }).split('=')[1].split(';')[0];

  	//wait a bit before using the cookie
    setTimeout(function(){

	  	//get data
	    const url = `https://www.barchart.com/proxies/timeseries/queryminutes.ashx?symbol=${instrument}&interval=1&start=${startDate.format('YYYYMMDD000000')}&end=${endDate.format('YYYYMMDD235959')}&volume=total&order=asc&dividends=false&backadjust=true&daystoexpiration=1&contractroll=combined`;
	    const options = {
	      url: url,
	      headers: {
	        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
	        'x-xsrf-token': xsrfToken,
	        'referer': 'https://www.barchart.com/futures/quotes/ESM19/interactive-chart',
	        'pragma': 'no-cache',
	        'cookie': cookies.join('; ')
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

		  if (res.statusCode !== 200) {
		  	  if (retryAttempt < numberOfRetries) {
		  	  	retryAttempt++;
			  	return getData(instrument, open, close, n, callback);
			  }
	  	  }
	
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
	
	}, 1);

  });

};

module.exports = getData;