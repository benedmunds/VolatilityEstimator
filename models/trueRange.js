'use strict';
const stats = require('../lib/stats.js');

module.exports = function(n, data){

    const calculateRange = function(data){

        let results = [];
        const n = data.length;

        for (let i=0; i<n; i++) {

          // First Record - Just set it based on this days data
          if (i === 0) {
            results.push(data[i]['high'] - data[i]['low']);
            continue;
          }

          // Calculate true range for the day
          const range = data[i]['high'] - data[i]['low'];
          const closeToHigh = Math.abs(data[i]['high'] - data[i-1]['close']);
          const closeToLow = Math.abs(data[i]['low'] - data[i-1]['close']);
          const trueRange = Math.max(range, closeToHigh, closeToLow);
          results.push(trueRange);

        }

        return results;

    };

    const dataset = calculateRange(data.reverse().slice(0, n).reverse());

    return {
        vol: dataset[0],
        stdDev: stats.standardDeviation(dataset),
        mean: stats.mean(dataset)
    };

};