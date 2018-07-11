'use strict';

const fs = require('fs');
const stats = require('./stats.js');
const c2c = require('./c2c.js');
const yz = require('./yangZhang.js');
const source = require('./data.json').map(function(v){
    return {
        date: v[0],
        open: v[1],
        high: v[2],
        low: v[3],
        close: v[4]
    };
}).reverse();


const n = 20; //20 period 



const c2cData = [...source];
const close2Close = c2c(n, c2cData, stats);
const close2CloseSigmas = {
    threeUp: c2cData[0].close + ((close2Close.mean + close2Close.stdDev) * 3),
    twoUp: c2cData[0].close + ((close2Close.mean + close2Close.stdDev) * 2),
    oneUp: c2cData[0].close + (close2Close.mean + close2Close.stdDev),
    lastClose: c2cData[0].close,
    oneDown: c2cData[0].close - (close2Close.mean + close2Close.stdDev),
    twoDown: c2cData[0].close - ((close2Close.mean + close2Close.stdDev) * 2),
    threeDown: c2cData[0].close - ((close2Close.mean + close2Close.stdDev) * 3),
};

const c2cOutput = `
### Close to Close

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Close-to-Close |  3 Sigma UP   |  ${stats.display(close2CloseSigmas.threeUp)} |
| Latest Data | ${c2cData[0].date}      |  2 Sigma UP   |  ${stats.display(close2CloseSigmas.twoUp)} |
| Periods     | ${n}             |  1 Sigma UP   |  ${stats.display(close2CloseSigmas.oneUp)} |
| Last Close  | ${close2CloseSigmas.lastClose.toFixed(2)}        |  Volatility   |   ${(close2Close.vol).toFixed(2)}  |
|             |                | 1 Sigma DOWN  |  ${stats.display(close2CloseSigmas.oneDown)} |
|             |                | 2 Sigma DOWN  |  ${stats.display(close2CloseSigmas.twoDown)} |
|             |                | 3 Sigma DOWN  |  ${stats.display(close2CloseSigmas.threeDown)} |
`;



const yzData = [...source];
const yangZhang = yz(n, yzData, stats);
const yzSigmas = {
    threeUp: yzData[0].close + ((yangZhang.mean + yangZhang.stdDev) * 3),
    twoUp: yzData[0].close + ((yangZhang.mean + yangZhang.stdDev) * 2),
    oneUp: yzData[0].close + (yangZhang.mean + yangZhang.stdDev),
    lastClose: yzData[0].close,
    oneDown: yzData[0].close - (yangZhang.mean + yangZhang.stdDev),
    twoDown: yzData[0].close - ((yangZhang.mean + yangZhang.stdDev) * 2),
    threeDown: yzData[0].close - ((yangZhang.mean + yangZhang.stdDev) * 3),
};

const yzOutput = `
### Yang-Zhang 

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Yang-Zhang     |  3 Sigma UP   |  ${stats.display(yzSigmas.threeUp)} |
| Latest Data | ${yzData[0].date}      |  2 Sigma UP   |  ${stats.display(yzSigmas.twoUp)} |
| Periods     | ${n}             |  1 Sigma UP   |  ${stats.display(yzSigmas.oneUp)} |
| Last Close  | ${yzSigmas.lastClose.toFixed(2)}        |  Volatility   |   ${(yangZhang.vol).toFixed(2)}  |
|             |                | 1 Sigma DOWN  |  ${stats.display(yzSigmas.oneDown)} |
|             |                | 2 Sigma DOWN  |  ${stats.display(yzSigmas.twoDown)} |
|             |                | 3 Sigma DOWN  |  ${stats.display(yzSigmas.threeDown)} |
`;

const output = `# Volatility Estimator
Implementation of various volatility calculations in Javascript.

Data represents the E-mini S&P 500 Futures

Currently supports Close-to-Close (http://www.todaysgroep.nl/media/236846/measuring_historic_volatility.pdf) and Yang-Zhang (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.628.4037&rep=rep1&type=pdf) volatility models.


## Latest Calculations
${c2cOutput}

${yzOutput}
`;


fs.writeFileSync('./README.md', output);

console.log(output);