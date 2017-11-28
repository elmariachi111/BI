const _ = require('lodash');

module.exports = class GroupBuckets {

    constructor(identifier) {
        this.errs = 0;
        this.counted = 0;
        this.countCustomers = 0;

        this.buckets = {};
        this.identifier = identifier;
    }

    error() {
        this.errs++;
    }

    add(customer, tail) {
        this.countCustomers++;
        return this.aggregate(customer).then(key => {
            this.counted++;
            if (tail.length > 0) {
                if (this.buckets[key]['next'] == undefined) {
                    this.buckets[key]['next'] = tail[0]();
                }
                this.buckets[key]['next'].add(customer, _.slice(tail, 1));
            }
        }).catch(() => {
            this.error();
        });
    }

}