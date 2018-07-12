'use strict';

//Bootstrap
const fs = require('fs');
const stats = require('./lib/stats.js');
const view = require('./lib/view.js');
const c2c = require('./models/c2c.js');
const yz = require('./models/yangZhang.js');
const source = require('./data/es.json').map(function(v){
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
const output = `## ${instrument}
${c2cOutput}
${yzOutput}
`;

//Write output to README.md and to the console
fs.writeFileSync(`output/${instrument.replace(/\W/g,'')}.md`, output);
console.log(output);