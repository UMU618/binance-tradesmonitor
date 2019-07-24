/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('../conf')
const assert = require('assert')
const fetch = require('node-fetch')

const url = conf.baseUrl + 'account/'

module.exports = {
  getAccount: function (name) {
    assert(name, 'no name')
    return fetch(url + name)
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
