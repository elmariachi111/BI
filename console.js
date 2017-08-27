const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');

BI.query({'status': {$in: ['won', 'cleared']} })
    //.group(BI.yearkw)
    .group(BI.gender)
    .group(BI.source)
    .group(BI.age)
    .sum(BI.provision, 'provision')
.cluster()
.then(buckets => {
    buckets.report();
    con.then(db => { db.close() });
})