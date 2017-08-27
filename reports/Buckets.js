const _ = require('lodash');

module.exports = class Buckets {

    constructor(buckets, adder) {
        this.errs = 0;
        this.buckets = buckets;

        this.adder = adder;

        this.subbucketFactory = null;
        this.subbuckets = {};
    }

    add(customer) {
        let key = this.adder.call(this, customer);
        if (key === false) {
            this.errs++;
            return;
        }
        this.buckets[key]++;

        if (this.subbucketFactory != null) {
            if (this.subbuckets[key] == undefined) {
                this.subbuckets[key] = this.subbucketFactory();
            }
            this.subbuckets[key].add(customer);
        }
    }

    error() {
        this.errs++;
    }

    addSubBucket(bucketFactory) {
        this.subbucketFactory = bucketFactory;
    }

    report() {
        _.each(this.buckets, (value, key) => {
            console.log(key + ': ' + value);
            if (this.subbuckets[key] != undefined) {
                this.subbuckets[key].report();
            }
        });
    }

    static range (from, to, step) {
        let buckets = {};
            _.range(from, to, step).forEach(r => {
            buckets[r] = 0;
        });
        return buckets;
    }
}