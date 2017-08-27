const con = require('../db');
const _ = require('lodash');

const Customer = require('./Customer');
const Buckets = {
    GroupBuckets: require('./GroupBuckets'),
    AggregateBuckets: require('./AggregateBuckets')
};

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
        this.chain = [];
    }

    cluster() {
        let firstBucket = this.chain[0]();
        let rest = _.slice(this.chain, 1);

        return new Promise( (resolve, reject) => {
            this.query().then(cursor => {
                cursor.forEach(doc => {
                    let customer = new Customer(doc);
                    firstBucket.add(customer, rest);
                }, () => {
                    resolve(firstBucket)
                });
            })
        });
    }

    group(identifier) {
        this.chain.push(
            function() {
                return new Buckets.GroupBuckets(identifier)
            });
        return this;
    }

    sum(identifier, name) {
        this.chain.push(function() {
            return new Buckets.AggregateBuckets(identifier, name)
        });
        return this;
    }
}

module.exports = {
    query,
    age: function(customer) {
        if (customer.age > 0) {
            let ageRange = (Math.floor(customer.age / 10)) * 10;
            return ageRange;
        } else {
            return false;
        }
    },
    yearkw: function(customer) {
        return customer.createdAt.format('YYYY/ww');
    },
    gender: function(customer) {
        return customer.gender;
    },
    source: function(customer) {
        return customer.source;
    },
    provision: function(customer) {
        return customer.provision;
    }
};

