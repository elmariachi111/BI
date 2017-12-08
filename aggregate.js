const con = require('./db');
const _ = require('lodash');

con.then(db => {
    cursor = db.collection('ratings').aggregate([
        {
            '$match': {type: 'surgery'}
        },
        {
            '$lookup': {
                from: 'doctors',
                localField: 'doctor',
                foreignField: '_id',
                as:'doctor'
            }   
        }, {
                '$group': {_id: "$doctor", count: {$sum: 1} }
        }
    ])
    cursor.toArray((err, docs) => {
        _.each(docs, d => {
            if (d['_id'].length == 0) {
                debugger;
                return;
            }

            let doc = d['_id'][0];
            console.log(doc.firstName + " " + doc.lastName + "\t" + d.count)
            db.close()
        });

    })
})
