const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');

new BI.ClusterBy()
    .query()
    //.group(BI.location())
    //.group(BI.yearkw())
    //.group(BI.zip1())
    //.group(BI.gender())
    //.group(BI.age(10))
    //.group(BI.source())
    .group(BI.conversion())

    .sum(BI.provision(), 'provision')

.execute()
.then(buckets => {
    buckets.report();
    con.then(db => { db.close() });
})
