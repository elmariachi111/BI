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
        this.buckets = null;
    }

    cluster() {
        return new Promise( (resolve, reject) => {
            this.query().then(cursor => {
                cursor.forEach(doc => {
                    this.buckets.add(new Customer(doc));
                }, () => {
                    resolve(this.buckets)
                });
            })
        });
    }

    add(bucketFactory) {
        if (null == this.buckets) {
            this.buckets = bucketFactory();
        } else {
            this.buckets.addSubBucket(bucketFactory);
        }
        return this;
    }

}

module.exports = {
    query,
    age: function() {
        return new Buckets(Buckets.range(10, 90, 10), function (customer) {
            if (customer.age > 0) {
                let ageRange = (Math.floor(customer.age / 10)) * 10;
                return ageRange;
            } else {
                return false;
            }
        });
    },
    gender: function() {
        return new Buckets({male: 0, female: 0}, function (customer) {
            return customer.gender;
        });
    }
};

