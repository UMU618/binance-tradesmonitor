/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('./conf')
const trades = require('./binance/trades')
const account = require('./binance/account')
const path = require('path')
const sqlite = require('sqlite3')

const now = Date.now()
const today = now - now % conf.ms_per_day
const yesterday = today - conf.ms_per_day

const addressTrade = new Map()
const dbPath = path.join(__dirname, 'data', conf.dbFilename)
const db = new sqlite.Database(dbPath)

main()

function main() {
  console.log('Today is', new Date(today))

  if (process.argv.length > 2 && process.argv[2] == '--local') {
    console.log('Processing trades of yesterday', new Date(yesterday)
      , 'from local database')
    getTradesFromDatabase(yesterday, today)
  } else {
    console.log('Fetching trades of yesterday', new Date(yesterday))
    getTrades(yesterday, today)
  }
}

function calc(t) {
  const amount = parseFloat(t.quantity)
  // 2: const amount = parseFloat(t.price) * parseFloat(t.quantity)
  if (addressTrade.has(t.buyerId)) {
    addressTrade.set(t.buyerId, addressTrade.get(t.buyerId) + amount)
  } else {
    addressTrade.set(t.buyerId, amount)
  }
  if (addressTrade.has(t.sellerId)) {
    addressTrade.set(t.sellerId, addressTrade.get(t.sellerId) + amount)
  } else {
    addressTrade.set(t.sellerId, amount)
  }
}

function getTrades(start, end, offset, limit) {
  if (typeof offset !== 'number') {
    offset = 0
  }

  trades
    .getTrades(start, end, offset, limit)
    .then((jo) => {
      if (jo) {
        console.log('Fetched', jo.trade.length + '@' + offset + '/' + jo.total)
        db.serialize(() => {
          let insertCount = 0
          let existsCount = 0
          const stmt = db.prepare('INSERT INTO trades VALUES(?, ?, ?, ?, ?, ?, ?)')
          for (let t of jo.trade) {
            calc(t)

            stmt.run(t.tradeId, t.symbol, t.price, t.quantity, t.buyerId
              , t.sellerId, t.time, (err) => {
                if (err) {
                  if (err.errno == 19) {
                    ++existsCount
                    //console.error(err.message)
                    // { [Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: trades.tradeId] errno: 19, code: 'SQLITE_CONSTRAINT' }
                  } else {
                    console.error(err)
                    //throw err
                  }
                } else {
                  ++insertCount
                  //console.log('INSERT', t.tradeId)
                }
              })
          }
          stmt.finalize((err) => {
            if (err) {
              console.error('finalize error:', err)
            } else {
              console.log(insertCount + ' inserted, ' + existsCount
                + ' already exists.')
            }
          })
        })

        if (jo.trade.length + offset < jo.total) {
          getTrades(start, end, jo.trade.length + offset, limit)
        } else {
          analyze()
        }
      } else {
        // 重试
        setTimeout(() => {
          console.log('Retry getTrades(' + start + ', ' + end + ', ' + offset
            + ', ' + limit + ')...')
          getTrades(start, end, offset, limit)
        }, 3000)
      }
    })
}

// For developing
function getTradesFromDatabase(yesterday, today) {
  db.serialize(() => {
    db.each(`SELECT * FROM trades WHERE time>=${yesterday} AND time<${today}`
      , (err, row) => {
      if (err) {
        console.error('SELECT balance=-1.0 error:', err)
      } else {
        calc(row)
      }
    }, (err, count) => {
      if (err) {
        console.error(err)
      } else if (count) {
        analyze()
      } else {
        console.log('No trade!')
      }
    })
  })
}

function analyze() {
  const addresses = []

  addressTrade.forEach((v, k, m) => {
    if (v >= conf.quantityEveryday) {
      //console.log(k, v.toFixed(8))
      addresses.push({address: k, amount: v})
    } else {
      //console.log(k, v.toFixed(8))
    }
  })

  if (addresses.length > 0) {
    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO addresses VALUES(?, ?, ?, ?, ?, ?)')
      for (const address of addresses) {
        stmt.run(address.address, address.amount, yesterday, -1, -1.0, -1.0
          , (err) => {
            if (err) {
              if (err.errno == 19) {
                //console.error(err.message)
                // { [Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: trades.tradeId] errno: 19, code: 'SQLITE_CONSTRAINT' }
              } else {
                console.error(err)
                //throw err
              }
            } else {
              console.log('INSERT', address.address, address.amount, yesterday)
            }
          })
      }
      stmt.finalize()
    })

    getBalance()
  } else {
    console.log('None matched!')
  }
}

const addressBalance = []

function getBalance() {
  db.serialize(() => {
    db.each(`SELECT * FROM addresses WHERE time=${yesterday} AND hit=-1`
      , (err, row) => {
      if (err) {
        console.error('SELECT balance=-1 error:', err)
      } else {
        addressBalance.push(row)
      }
    }, (err, count) => {
      if (err) {
        console.error(err)
      } else if (count) {
        getAddressBalance()
      } else {
        console.log('None!')
      }
    })
  })
}

function getAddressBalance() {
  if (addressBalance.length > 0) {
    const a = addressBalance.pop()
    account
      .getAccount(a.address)
      .then((jo) => {
        if (jo && jo.balances) {
          let baseBalance = 0.0
          let quoteBalance = 0.0
          let hit = 0
          for (const b of jo.balances) {
            if (b.symbol == conf.baseAsset) {
              baseBalance = parseFloat(b.free) + parseFloat(b.locked)
            } else if (b.symbol == conf.quoteAsset) {
              quoteBalance = parseFloat(b.free) + parseFloat(b.locked)
            }
          }
          if (baseBalance >= conf.baseQuantity
            && quoteBalance >= conf.quoteQuantity) {
            hit = 1
          }
          db.run(`UPDATE addresses SET baseBalance=${baseBalance}, quoteBalance=${quoteBalance}, hit=${hit} WHERE address="${a.address}" AND time=${a.time}`
            , (err) => {
              if (err) {
                console.error('UPDATE addresses error:', err)
              } else {
                console.log('UPDATE', a.address, 'to', baseBalance, quoteBalance, hit)
              }
            })
        }
        getAddressBalance()
      })
  }
}