const _ = require('lodash');

module.exports = class Buckets {

    constructor(buckets, adder) {
        this.errs = 0;
        this.buckets = buckets;
        this.adder = adder;
    }

    add(customer) {
        this.adder.call(this, customer)
    }

    error() {
        this.errs++;
    }

    static range (from, to, step) {
        let buckets = {};
            _.range(from, to, step).forEach(r => {
            buckets[r] = 0;
        });
        return buckets;
    }
}