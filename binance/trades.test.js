const trades = require('./trades')
const conf = require('../conf')

const start = (Math.floor(Date.now() / conf.period) - 1) * conf.period
const end = Math.floor(Date.now() / conf.period) * conf.period
console.log(new Date(start) + ' ~ ' + new Date(end))

trades
  .getTrades(start, end)
  .then((jo) => {
    if (jo) {
      //console.log(jo)
      for (let t of jo.trade) {
        console.log(t.tradeId)
      }
    }
  })
