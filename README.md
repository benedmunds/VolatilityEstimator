# Volatility Estimator
Implementation of various volatility calculations in Javascript.

Data represents the E-mini S&P 500 Futures

Currently supports Close-to-Close (http://www.todaysgroep.nl/media/236846/measuring_historic_volatility.pdf) and Yang-Zhang (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.628.4037&rep=rep1&type=pdf) volatility models.


## Latest Calculations

### Close-to-Close

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Close-to-Close |  3 Sigma UP   |  2846.75 |
| Latest Data | 7/10/2018      |  2 Sigma UP   |  2830.00 |
| Periods     | 20             |  1 Sigma UP   |  2813.25 |
| Last Close  | 2796.50        |  Volatility   |   15.83  |
|             |                | 1 Sigma DOWN  |  2779.75 |
|             |                | 2 Sigma DOWN  |  2763.00 |
|             |                | 3 Sigma DOWN  |  2746.25 |


### Yang Zhang

| /ES         |                | Stat          | Value    |
| ----------- | -------------- | ------------- | -------- |
| Method      | Yang Zhang     |  3 Sigma UP   |  2850.00 |
| Latest Data | 7/10/2018      |  2 Sigma UP   |  2832.25 |
| Periods     | 20             |  1 Sigma UP   |  2814.25 |
| Last Close  | 2796.50        |  Volatility   |   18.32  |
|             |                | 1 Sigma DOWN  |  2778.75 |
|             |                | 2 Sigma DOWN  |  2760.75 |
|             |                | 3 Sigma DOWN  |  2743.00 |

