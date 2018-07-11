'use strict';

const stats = require('./stats.js');
const yz = require('./yangZhang.js');
const data = require('./data.json').map(function(v){
    return {
        date: v[0],
        open: v[1],
        high: v[2],
        low: v[3],
        close: v[4]
    };
}).reverse();


const n = 20; //20 period 

const yangZhang = yz(n, data, stats);

const yzSigmas = {
    threeUp: data[0].close + ((yangZhang.mean + yangZhang.stdDev) * 3),
    twoUp: data[0].close + ((yangZhang.mean + yangZhang.stdDev) * 2),
    oneUp: data[0].close + (yangZhang.mean + yangZhang.stdDev),
    lastClose: data[0].close,
    oneDown: data[0].close - (yangZhang.mean + yangZhang.stdDev),
    twoDown: data[0].close - ((yangZhang.mean + yangZhang.stdDev) * 2),
    threeDown: data[0].close - ((yangZhang.mean + yangZhang.stdDev) * 3),
};

console.log(`
    Method: Yang-Zhang
    Date: ${data[0].date}
    Periods: ${n}

    3 Sigma UP: ${stats.display(yzSigmas.threeUp)}
    2 Sigma UP: ${stats.display(yzSigmas.twoUp)}
    1 Sigma UP: ${stats.display(yzSigmas.oneUp)}

    Last Close: ${yzSigmas.lastClose.toFixed(2)}
    YZ Volatility - Estimate: ${(yangZhang.vol).toFixed(2)}
    YZ Volatility - 1 Sigma:  ${(yangZhang.mean + yangZhang.stdDev).toFixed(2)}

    1 Sigma DOWN: ${stats.display(yzSigmas.oneDown)}
    2 Sigma DOWN: ${stats.display(yzSigmas.twoDown)}
    3 Sigma DOWN: ${stats.display(yzSigmas.threeDown)}
`);
