const _ = require('lodash');

module.exports = class Buckets {

    constructor(adder) {
        this.buckets = {};
        this.errs = 0;
        this.adder = adder;
        _.range(10, 90, 10).forEach(r => {
            this.buckets[r] = 0;
        });
    }

    add(customer) {
        this.adder.call(this, customer)
    }

    error() {
        this.errs++;
    }
}