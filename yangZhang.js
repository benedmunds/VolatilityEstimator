// 'use strict';
const stats = require('./stats.js');

module.exports = function(n, data){

    const calculateVol = function(data){

        let close_vol = 0;
        let open_vol = 0;
        let window_rs = 0;

        for (let i=1; i<data.length; i++) {
        
            log_ho = Math.log(data[i]['high'] / data[i]['open']);
            log_lo = Math.log(data[i]['low'] / data[i]['open']);
            log_co = Math.log(data[i]['close'] / data[i]['open']);
            
            log_oc = Math.log(data[i]['open'] / data[i-1]['close']);
            log_oc_sq = Math.pow(log_oc, 2);
            
            log_cc = Math.log(data[i]['close'] / data[i-1]['close']);
            log_cc_sq = Math.pow(log_cc, 2);
            
            rs = log_ho * (log_ho - log_co) + log_lo * (log_lo - log_co);
            
            close_vol += log_cc_sq;
            open_vol += log_oc_sq;
            window_rs += rs;

        }

        close_vol = close_vol * (1.0 / (n - 1.0));
        open_vol = open_vol * (1.0 / (n - 1.0));
        window_rs = window_rs * (1.0 / (n - 1.0));

        const k = 0.34 / ( 1.34 + ( n + 1 ) / ( n - 1 ) );
        return (Math.sqrt(open_vol + k * close_vol + (1 - k) * window_rs) * Math.sqrt(252)) * 100;
        
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