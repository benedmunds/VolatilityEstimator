'use strict';

module.exports = {

    markdown: function(instrument, tickSize, date, n, close, viewName, modelOneName, modelOne, modelTwoName, modelTwo){

        return `
### ${viewName}

| ${instrument.padEnd(20, ' ')} |
| -------------------- | --------------
| Latest Data          | ${date}
| Periods              | ${n}
| ${modelOneName.padEnd(20, ' ')} | ${(modelOne).toFixed(2).padEnd(6, ' ')}
| ${modelTwoName.padEnd(20, ' ')} | ${(modelTwo).toFixed(2).padEnd(6, ' ')}
`;

    },

    html: function(instrument, tickSize, date, n, close, viewName, modelOneName, modelOne, modelTwoName, modelTwo){

        return `<style>body,table tr{background-color:#fff}table,table tr{padding:0}table tr td,table tr th{border:1px solid #ccc;text-align:left;margin:0;padding:6px 13px}body{font-family:Helvetica,arial,sans-serif;font-size:14px;line-height:1.6;padding-bottom:20px}table tr{border-top:1px solid #ccc;margin:0}table tr:nth-child(2n){background-color:#f8f8f8}table tr th{font-weight:700}table tr td :first-child,table tr th :first-child{margin-top:0}table tr td :last-child,table tr th :last-child{margin-bottom:0}</style>
<h3>${viewName}</h3>

<table cellspacing=0 cellpadding=0>

    <thead>
        <tr>
            <th>${instrument}</th>
            <th></th>
        </tr>
    </thead>

    <tbody>

        <tr>
            <td>Latest Data</td>
            <td>${date}</td>
        </tr>

        <tr>
            <td>Periods</td>
            <td>${n}</td>
        </tr>

        <tr>
            <td>${modelOneName}</td>
            <td>${(modelOne).toFixed(2)}</td>
        </tr>

        <tr>
            <td>${modelTwoName}</td>
            <td>${(modelTwo).toFixed(2)}</td>
        </tr>

    </tbody>

</table>
`;

    }

};