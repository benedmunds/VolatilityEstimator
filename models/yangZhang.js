'use strict';
const stats = require('../lib/stats.js');

module.exports = function(n, data){

    //YZ calc ported from https://github.com/jasonstrimpel/volatility-trading/blob/master/volatility/models/YangZhang.py
    const calculateVol = function(data){

        let close_vol = 0;
        let open_vol = 0;
        let window_rs = 0;

        data = data.reverse();

        for (let i=1; i<data.length; i++) {
        
            const log_ho = Math.log(data[i]['high'] / data[i]['open']);
            const log_lo = Math.log(data[i]['low'] / data[i]['open']);
            const log_co = Math.log(data[i]['close'] / data[i]['open']);
            
            const log_oc = Math.log(data[i]['open'] / data[i-1]['close']);
            const log_oc_sq = Math.pow(log_oc, 2);
            
            const log_cc = Math.log(data[i]['close'] / data[i-1]['close']);
            const log_cc_sq = Math.pow(log_cc, 2);
            
            const rs = log_ho * (log_ho - log_co) + log_lo * (log_lo - log_co);
            
            close_vol += log_cc_sq;
            open_vol += log_oc_sq;
            window_rs += rs;

        }

        close_vol = close_vol * (1.0 / (n - 1.0));
        open_vol = open_vol * (1.0 / (n - 1.0));
        window_rs = window_rs * (1.0 / (n - 1.0));

        const k = 0.34 / ( 1.34 + ( n + 1 ) / ( n - 1 ) );
        const yz = open_vol + (k * close_vol) + ((1 - k) * window_rs);

        return data[0].close * (yz * 100);
        
    };

    //generate YZ vol for each item in the N period
    data.reverse();
    let dataset = [];
    for (let i=n-1; i>=0; --i) {

      const rolling = data.slice(i, (n+i-1));
      dataset.push(calculateVol(rolling));

    }

    return {
        vol: dataset[0],
        stdDev: stats.standardDeviation(dataset),
        mean: stats.mean(dataset)
    };

};