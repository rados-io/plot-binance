const _ = require('lodash')
const wrapPlotly = require('runkit-plotly')

var makeChart = wrapPlotly((data, elem, Plotly) => {
    var trace = {
        x: data.x,
        open: data.open,
        close: data.close,
        high: data.high,
        low: data.low,
        decreasing: { line: { color: '#7F7F7F' } },
        increasing: { line: { color: '#17BECF' } },
        line: { color: 'rgba(31,119,180,1)' },
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y2',
        name: data.market
    }

    var volumes = {
        x: data.x,
        y: data.volume,
        marker: { color: data.volumeColors },
        type: 'bar',
        yaxis: 'y',
        name: 'Volume'
    }

    let max = data.x;
    max.shift()

    var movingAverage =  {
        x: max,
        y: data.movingAverage,
        type: 'scatter',
        mode: 'lines',
        line: { width: 1 },
        marker: { color: '#E377C2' },
        yaxis: 'y2',
        name: 'Moving Average'
    }

    var layout = {
        plot_bgcolor: 'rgb(250, 250, 250)',
        xaxis: { rangeselector: { visible: true } },
        yaxis: { domain: [0, 0.2], showticklabels: false },
        yaxis2: { domain: [0.2, 0.8] },
        legend: { orientation: 'h', y: 0.9, x: 0.3, yanchor: 'bottom' },
        margin: { t: 80, b: 20, r: 40, l: 60 },
        title: data.market + '. Powered by Radex.ai'
    }

    Plotly.newPlot(elem, [trace, volumes, movingAverage], layout)
})

let INCREASING = '#17BECF'
let DECREASING = '#7F7F7F'

function window(_number, index, array) {
  const start = Math.max(0, index - 10)
  return _.slice(array, start, index)
}

function sum(numbers) {
  return _.reduce(numbers, (a, b) => a + b, 0)
}

function average(numbers) {
  return sum(numbers) / (numbers.length || 1)
}

function moving_average(numbers) {
  return _.chain(numbers)
          .map(window)
          .map(average)
          .value()
}

module.exports = (prices, market) => {
  let volume = _.map(prices, (candle) => { return candle.volume })
  let close = _.map(prices, (candle) => { return parseFloat(candle.close) })
  let movingAverage = moving_average(close)
  let volumeColors = _.map(volume, (v, i, a) => {
    if (i === 0) { return DECREASING }
    return a[i] > a[i-1] ? INCREASING : DECREASING
  })

  return makeChart({
    x: _.map(prices, (candle) => { return new Date(candle.openTime) }),
    open: _.map(prices, (candle) => { return candle.open }),
    close: close,
    high: _.map(prices, (candle) => { return candle.high }),
    low: _.map(prices, (candle) => { return candle.low }),
    movingAverage: _.tail(movingAverage),
    volume: volume,
    volumeColors: volumeColors,
    market: market
  })
}
