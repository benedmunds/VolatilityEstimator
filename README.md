# Volatility Estimator
Implementation of various volatility calculations in Javascript.

Data represents the E-mini S&P 500 Futures

Currently supports Close-to-Close (http://www.todaysgroep.nl/media/236846/measuring_historic_volatility.pdf) and Yang-Zhang (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.628.4037&rep=rep1&type=pdf) volatility models.


## Latest Calculations

### Close-to-Close

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Close-to-Close |  3 Sigma UP   |  2824.25 |
| Latest Data | 7/11/2018      |  2 Sigma UP   |  2807.50 |
| Periods     | 20             |  1 Sigma UP   |  2790.50 |
| Last Close  | 2773.75        |  Volatility   |   15.94  |
| 1 Sigma Vol | 16.75          | 1 Sigma DOWN  |  2757.00 |
|             |                | 2 Sigma DOWN  |  2740.00 |
|             |                | 3 Sigma DOWN  |  2723.25 |


### Yang Zhang

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Yang Zhang     |  3 Sigma UP   |  2827.00 |
| Latest Data | 7/11/2018      |  2 Sigma UP   |  2809.25 |
| Periods     | 20             |  1 Sigma UP   |  2791.50 |
| Last Close  | 2773.75        |  Volatility   |   18.32  |
| 1 Sigma Vol | 17.75          | 1 Sigma DOWN  |  2756.00 |
|             |                | 2 Sigma DOWN  |  2738.25 |
|             |                | 3 Sigma DOWN  |  2720.50 |

