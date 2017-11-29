const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');
const winston = require('winston');

winston.level = 'info';
winston.cli();

new BI.ClusterBy()
.query({
    //'source': 'phone',
    'createdAt': {'$gt': new Date('2017-01-01')},
    //'status': {$in: ['won', 'cleared']}
})
//.group(BI.location())
.group(BI.yearkw())
//.group(BI.zip1())
//.group(BI.age(5))
//.group(BI.location())
//.group(BI.gender())
//.group(BI.conversion())
//.sum(BI.provision(), 'provision')
.sum(BI.timeToFirstAppointment(['settled','occurred']), 'firstApp')

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
