'use strict';
const stats = require('../lib/stats.js');

module.exports = function(n, data){

    const calculateRange = function(data){

        let results = [];
        const n = data.length;

        for (let i=0; i<n; i++) {

          // First Record
          if (i === 0) {
            results.push({trueRange:data[i]['high'] - data[i]['low'], atr:0});
            continue;
          }

          let atr = 0;
          const range = data[i]['high'] - data[i]['low'];
          const closeToHigh = Math.abs(data[i]['high'] - data[i-1]['close']);
          const closeToLow = Math.abs(data[i]['low'] - data[i-1]['close']);
          const trueRange = Math.max(range, closeToHigh, closeToLow);

          // Last Record
          if (i === (n-1)) {
            return results.reduce((accumulator, val) => accumulator + val.trueRange, trueRange) / n;
          }

          atr = ((results[i-1].atr * (n-1) + trueRange) / n);
          results.push({trueRange:trueRange, atr:atr, date: data[i]['date']});

        }

    };

    //generate atr for N period
    return calculateRange(data.reverse().slice(0, n).reverse());

};