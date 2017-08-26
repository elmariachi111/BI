const _ = require('lodash');
const BI = require('./reports/BI');
const con = require('./db');

BI.query({'status': {$in: ['won', 'cleared']} })
.gender()
.then(buckets => {
    console.log('errs: ' + buckets.errs);
    _.forEach(buckets.buckets, (count, ageRange) => {
        console.log(ageRange + ': ' + count);
    })
    con.then(db => { db.close() });
})