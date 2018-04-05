# Plotting utilities for Binance

A code library for miscellaneous plotting utilities designed to work well with data produced by `binance-api-node` package.

For example, try running this code snippet on [runkit](https://runkit.com):

```js
const plot = require('plot-binance')
const Binance = require('binance-api-node').default
const client = Binance()

const market = 'ETCBTC' // change to see data for your favorite market
let prices = await client.candles({ symbol: market, interval: '6h' })
plot(prices, market)
```
