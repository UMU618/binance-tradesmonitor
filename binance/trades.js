/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('../conf')
const fetch = require('node-fetch')

const url = conf.baseUrl + 'trades?symbol=' + conf.symbol + '&total=1'

module.exports = {
  getTrades: function (start, end, offset, limit) {
    let u = url
    if (start) {
      u += '&start=' + start
    }
    if (end) {
      u += '&end=' + end
    }
    if (offset) {
      u += '&offset=' + offset
    }
    if (limit) {
      u += '&limit=' + limit
    }
    else {
      u += '&limit=' + conf.maxLimit
    }

    return fetch(u)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log('API failed, status = ' + res.status)
          return null
        }
      }
      , (e) => {
        console.error('Call API failed, error: ' + e)
        return null
      })
  }
};
