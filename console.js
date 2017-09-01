const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');
const winston = require('winston');

winston.level = 'info';
winston.cli();

new BI.ClusterBy()
.query({
    //'source': 'phone',
    'createdAt': {'$gt': new Date('2016-05-05')},
    //'status': {$in: ['won', 'cleared']}
})
//.group(BI.location())
//.group(BI.yearkw())
//.group(BI.zip1())
.group(BI.conversion())
//.group(BI.age(10))
.group(BI.location())
//.group(BI.gender())


//.sum(BI.provision(), 'provision')

.execute()
.then(buckets => {
    buckets.report();
    con.then(db => {
        db.close()
    });
})
.catch(err => {
    winston.error(err);
    con.then(db => db.close());
});
