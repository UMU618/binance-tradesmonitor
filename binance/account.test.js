const account = require('./account')

account
  .getAccount('bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m')
  .then((jo) => {
    if (jo) {
      console.log(jo.balances)
    }
  })