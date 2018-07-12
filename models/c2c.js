'use strict';
const stats = require('../lib/stats.js');

module.exports = function(n, data){

    //C2C calc ported from https://github.com/jasonstrimpel/volatility-trading/blob/master/volatility/models/Raw.py
    const calculateVol = function(data){
        
        let log_return = [];
        
        for (let i=1; i<data.length; i++) {
        
            log_return.push(Math.log(data[i]['close'] / data[i-1].close));

        }

        const vol = stats.standardDeviation(log_return);
        
        return data[0].close * vol;
    
    };

    //generate c2c vol for each item in the N period
    data.reverse();
    let dataset = [];
    for (let i=n-1; i>=0; --i) {

      const rolling = data.slice(i, (n+i-1));
      dataset.push(calculateVol(rolling));

    }

    return {
        vol: dataset[0],
        stdDev: stats.standardDeviation(dataset) * Math.sqrt(n/(n-1)),
        mean: stats.mean(dataset)
    };

};