/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('../conf')
const path = require('path')
const sqlite = require('sqlite3')

const sqls = [`CREATE TABLE trades(
    tradeId TEXT NOT NULL PRIMARY KEY,
    symbol TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    buyerId CHAR(${conf.idLength}) NOT NULL,
    sellerId CHAR(${conf.idLength}) NOT NULL,
    time INTEGER NOT NULL
  )`
  , 'CREATE INDEX idx_trades_tradeId ON trades(tradeId)'
  , 'CREATE INDEX idx_trades_buyerId ON trades(buyerId)'
  , 'CREATE INDEX idx_trades_sellerId ON trades(sellerId)'
  , 'CREATE INDEX idx_trades_time ON trades(time)'

  , `CREATE TABLE addresses(
    address CHAR(${conf.idLength}) NOT NULL,
    amount REAL NOT NULL,
    time INTEGER NOT NULL,
    hit INTEGER NOT NULL DEFAULT -1,
    baseBalance REAL NOT NULL,
    quoteBalance REAL NOT NULL,
    constraint pk primary key (address, time)
  )`
  , 'CREATE INDEX idx_addresses_address ON addresses(address)'
  , 'CREATE INDEX idx_addresses_time ON addresses(time)'
]

const dbPath = path.join(__dirname, conf.dbFilename)
const db = new sqlite.Database(dbPath)

db.serialize(() => {
  for (let sql of sqls) {
    db.run(sql, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('SQL executed.')
      }
    })
  }
})

db.close()
