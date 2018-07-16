# Volatility Estimator
Implementation of various volatility calculations in Javascript.  Outputs report via markdown and emails html version to requested recipients.

Example data represents the E-mini S&P 500 Futures.

Data is loaded via the Barcharts API.

Currently supports Close-to-Close (http://www.todaysgroep.nl/media/236846/measuring_historic_volatility.pdf) and Yang-Zhang (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.628.4037&rep=rep1&type=pdf) volatility models.


## Example Calculations
		
### Close-to-Close

| ESU18       |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Close-to-Close |  3 Sigma UP   |  2822.50 |
| Latest Data | 2018-07-11     |  2 Sigma UP   |  2806.25 |
| Periods     | 20             |  1 Sigma UP   |  2790.00 |
| Last Close  | 2773.75        |  Volatility   |   15.42  |
|             |                |  1 Sigma Vol  |   16.25  |
|             |                | 1 Sigma DOWN  |  2757.50 |
|             |                | 2 Sigma DOWN  |  2741.25 |
|             |                | 3 Sigma DOWN  |  2725.00 |

		
### Yang Zhang

| ESU18       |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Yang Zhang     |  3 Sigma UP   |  2813.75 |
| Latest Data | 2018-07-11     |  2 Sigma UP   |  2800.50 |
| Periods     | 20             |  1 Sigma UP   |  2787.00 |
| Last Close  | 2773.75        |  Volatility   |   10.33  |
|             |                |  1 Sigma Vol  |   13.25  |
|             |                | 1 Sigma DOWN  |  2760.50 |
|             |                | 2 Sigma DOWN  |  2747.00 |
|             |                | 3 Sigma DOWN  |  2733.75 |


## Setup

Copy ./.env.default to ./.env

Update .env with your email settings


## Example Usage

Call the index.js file from the command line with the following parameters:

    $ node index.js {instrument} {tickSize} {sessionStart} {sessionEnd} {period} {commaSeparatedEmailRecipients}


For example:

    $ node index.js 'ESU18' 0.25 '08:30' '15:14' 20 'yourEmail@gmail.com'

would generate a volatility report for the ESU18 futures for a session of 8:30-15:14 central, with a 20 period average, and email the report to yourEmail@gmail.com

or 

    $ node ./index.js 'CLQ18' 0.1 '08:00' '13:29' 20

would generate a volatility report for the CLQ18 futures for a session of 8:00-13:29 central, with a 20 period average, and not send an email (only generates output and markdown report if no email recipients are supplied).

