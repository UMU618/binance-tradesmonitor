# binance-tradesmonitor

同步 Binance DEX 到 SQLITE 数据库以便统计

## 1. Install

```
yarn install
```

Initialize database:

```
node data/init.js
```

## 2. Run

```
node yesterday-trades.js
```

run once everyday

2019-07-23 ~ 2019-08-20 UTC 00:01:00

## 3. Data

```
sqlite3 data/binance.db
sqlite> select * from addresses where hit=1;
sqlite> select time from addresses where hit=1 group by time;
sqlite> select count(*) from addresses where time=1563753600000;
sqlite> select count(*) from addresses where hit=1 and time=1563840000000;
```
