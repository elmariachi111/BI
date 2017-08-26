const _ = require('lodash');
const clusterBy = require('./reports/clusterBy');
const con = require('./db');

clusterBy.age({
    'sex': 'male',
    'status': {$in: ['won', 'cleared']}
}).then(buckets => {
    console.log(buckets.errs);
    _.forEach(buckets.buckets, (count, ageRange) => {
        console.log(ageRange + ': ' + count);
    })
    con.then(db => { db.close() });
})