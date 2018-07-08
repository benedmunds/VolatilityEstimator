// 'use strict';

(async function(){

    const n = 19; //20 period 

    const source = [
      // ['7/6/2018', 2738.75, 2766.25, 2734.50, 2762.50],
      // ['7/5/2018', 2729.50, 2739.50, 2717.00, 2738.50],
      ['7/3/2018', 2736.75, 2738.00, 2712.00, 2713.25],
      ['7/2/2018', 2702.50, 2728.50, 2700.50, 2727.25],
      ['6/29/2018', 2729.50, 2745.50, 2720.50, 2722.25],
      ['6/28/2018', 2700.75, 2726.50, 2693.50, 2719.25],
      ['6/27/2018', 2731.75, 2748.00, 2701.00, 2705.50],
      ['6/26/2018', 2725.50, 2735.25, 2717.25, 2728.50],
      ['6/25/2018', 2744.75, 2746.25, 2700.50, 2721.75],
      ['6/22/2018', 2767.25, 2768.50, 2755.25, 2759.75],
      ['6/21/2018', 2769.50, 2770.50, 2747.00, 2752.50],
      ['6/20/2018', 2774.00, 2778.25, 2767.00, 2771.75],
      ['6/19/2018', 2750.75, 2769.00, 2746.25, 2766.00],
      ['6/18/2018', 2766.75, 2780.00, 2761.25, 2779.75],
      ['6/15/2018', 2779.00, 2787.50, 2765.50, 2784.50],
      ['6/14/2018', 2790.50, 2794.00, 2781.00, 2788.75],
      ['6/13/2018', 2792.50, 2796.00, 2778.50, 2778.50],
      ['6/12/2018', 2790.50, 2794.00, 2782.75, 2787.75],
      ['6/11/2018', 2784.25, 2794.25, 2783.00, 2786.50],
      ['6/08/2018', 2768.75, 2783.25, 2766.75, 2782.50],
      ['6/07/2018', 2780.25, 2783.25, 2763.75, 2775.50],
      ['6/06/2018', 2758.75, 2776.25, 2751.75, 2776.25]
    ];

    const data = source.map(function(v){
        return {
            date: v[0],
            open: v[1],
            high: v[2],
            low: v[3],
            close: v[4]
        };
    }).reverse();


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

        const k = 0.34 / (1 + (n + 1) / (n - 1));
        return (Math.sqrt(open_vol + k * close_vol + (1 - k) * window_rs) * Math.sqrt(252)) * 100;

    };

    
    console.log(calculateVol(data));


    // const sigmas = {
    //     threeUp: (data[data.length - 1].close + (result * 3)).toFixed(2),
    //     twoUp: (data[data.length - 1].close + (result * 2)).toFixed(2),
    //     oneUp: (data[data.length - 1].close + result).toFixed(2),
    //     lastClose: (data[data.length - 1].close).toFixed(2),
    //     oneDown: (data[data.length - 1].close - result).toFixed(2),
    //     twoDown: (data[data.length - 1].close - (result * 2)).toFixed(2),
    //     threeDown: (data[data.length - 1].close - (result * 3)).toFixed(2),
    // };

    // console.log(`
    //     Date: ${data[data.length - 1].date}

    //     3 Sigma UP: ${sigmas.threeUp}
    //     2 Sigma UP: ${sigmas.twoUp}
    //     1 Sigma UP: ${sigmas.oneUp}

    //     Last Close: ${sigmas.lastClose}
    //     YZ C2C Vol: ${result}
    //     Expected Vol: 14.50

    //     1 Sigma DOWN: ${sigmas.oneDown}
    //     2 Sigma DOWN: ${sigmas.twoDown}
    //     3 Sigma DOWN: ${sigmas.threeDown}
    // `);


})();