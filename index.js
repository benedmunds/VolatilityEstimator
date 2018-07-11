'use strict';

//Bootstrap
const fs = require('fs');
const stats = require('./stats.js');
const c2c = require('./c2c.js');
const yz = require('./yangZhang.js');
const view = require('./view.js');
const source = require('./data.json').map(function(v){
    return {
        date: v[0],
        open: v[1],
        high: v[2],
        low: v[3],
        close: v[4]
    };
}).reverse();


//Config
const instrument = '/ES';
const n = 20; //20 period 


//Build out the data models
const c2cData = [...source];
const close2CloseModel = c2c(n, c2cData, stats);
const c2cOutput = view(instrument, c2cData[0].date, n, c2cData[0].close, 'Close-to-Close', close2CloseModel);

const yzData = [...source];
const yangZhangModel = yz(n, yzData, stats);
const yzOutput = view(instrument, yzData[0].date, n, yzData[0].close, 'Yang Zhang', yangZhangModel);


//Format Output
const output = `# Volatility Estimator
Implementation of various volatility calculations in Javascript.

Data represents the E-mini S&P 500 Futures

Currently supports Close-to-Close (http://www.todaysgroep.nl/media/236846/measuring_historic_volatility.pdf) and Yang-Zhang (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.628.4037&rep=rep1&type=pdf) volatility models.


## Latest Calculations
${c2cOutput}
${yzOutput}
`;


//Write output to README.md and to the console
fs.writeFileSync('./README.md', output);
console.log(output);