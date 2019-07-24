/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const baseAsset = 'MEETONE-031'
const quoteAsset = 'BNB'
const MS_PER_DAY = 24 * 60 * 60 * 1000

module.exports = Object.freeze({
  baseUrl: 'https://dex.binance.org/api/v1/'
  , baseAsset: baseAsset
  , quoteAsset: quoteAsset
  , symbol: baseAsset + '_' + quoteAsset
  , idLength: 42
  , ms_per_day: MS_PER_DAY
  , period: MS_PER_DAY
  , maxLimit: 1000
  , dbFilename: 'binance.db'
  , quantityEveryday: 100000.0 // 每天交易超过 10 万个 MEETONE
  //, amountEveryday: 10000.0 // 每天交易超过 1 万 USD（取消）
  , baseQuantity: 10000.0 // 每日持有 1BNB 和 1 万 MEET.ONE
  , quoteQuantity: 1.0
})
