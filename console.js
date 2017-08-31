const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');

new BI.ClusterBy()
    .query({
        'source': 'core',
        'createdAt': {'$gt': new Date('2016-05-05')},
        'status': {$in: ['won','cleared']}
    })
    //.group(BI.location())
    //.group(BI.yearkw())
    //.group(BI.zip1())

    //.group(BI.age(10))
    .group(BI.location())
    //.group(BI.gender())
    //.group(BI.conversion())

    //.sum(BI.provision(), 'provision')

.execute()
.then(buckets => {
    buckets.report();
    con.then(db => { db.close() });
})
