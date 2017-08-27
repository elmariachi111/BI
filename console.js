const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');

BI.query({'status': {$in: ['won', 'cleared']} })
    .add(BI.gender)
    .add(BI.age)
.cluster()
.then(buckets => {
    buckets.report();
    con.then(db => { db.close() });
})