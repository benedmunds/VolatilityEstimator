'use strict';

module.exports = {

    markdown: function(instrument, tickSize, date, n, close, modelName, model){

        return `
### ${modelName}

| ${instrument.padEnd(11, ' ')} |
| ----------- | --------------
| Method      | ${modelName.padEnd(14, ' ')}
| Latest Data | ${date}
| Periods     | ${n}
| Value       | ${(model).toFixed(2).padEnd(6, ' ')}
`;

    },

    html: function(instrument, tickSize, date, n, close, modelName, model){

        return `<style>body,table tr{background-color:#fff}table,table tr{padding:0}table tr td,table tr th{border:1px solid #ccc;text-align:left;margin:0;padding:6px 13px}body{font-family:Helvetica,arial,sans-serif;font-size:14px;line-height:1.6;padding-bottom:20px}table tr{border-top:1px solid #ccc;margin:0}table tr:nth-child(2n){background-color:#f8f8f8}table tr th{font-weight:700}table tr td :first-child,table tr th :first-child{margin-top:0}table tr td :last-child,table tr th :last-child{margin-bottom:0}</style>
<h3>${modelName}</h3>

<table cellspacing=0 cellpadding=0>

    <thead>
        <tr>
            <th>${instrument}</th>
            <th></th>
        </tr>
    </thead>

    <tbody>

        <tr>
            <td>Method</td>
            <td>${modelName}</td>
        </tr>

        <tr>
            <td>Latest Data</td>
            <td>${date}</td>
        </tr>

        <tr>
            <td>Periods</td>
            <td>${n}</td>
        </tr>

        <tr>
            <td>Value</td>
            <td>${(model).toFixed(2)}</td>
        </tr>

    </tbody>

</table>
`;

    }

};