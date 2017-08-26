const con = require('../db');
const _ = require('lodash');

const Customer = require('./Customer');
const Buckets = require('./Buckets');

const query = function(query, buckets) {

    return new ClusterBy(function() {
        return new Promise((resolve, reject) => {
            con.then(db => {
                const col = db.collection('customers');
                const cursor = col.find(query);

                resolve(cursor);
            })
        });
    });
}

class ClusterBy {

    /**
     * @param query function returning a promise on an iterable (cursor)
     */
    constructor(query) {
        this.query = query;
    }

    cluster(buckets) {
        return new Promise( (resolve, reject) => {
            this.query().then(cursor => {
                cursor.forEach(doc => {
                    buckets.add(new Customer(doc))
                }, () => {
                    resolve(buckets)
                });
            })
        });
    }

    age() {
        let buckets = new Buckets(Buckets.range(10, 90, 10), function (customer) {
            if (customer.age > 0) {
                let ageRange = (Math.floor(customer.age / 10)) * 10;
                this.buckets[ageRange]++;
            } else {
                this.error();
            }
        });

        return this.cluster(buckets);
    }

    gender() {
        let buckets = new Buckets({male: 0, female: 0}, function (customer) {
            this.buckets[customer.gender]++;
        });

        return this.cluster(buckets);
    }
}

module.exports = {
    query
};

