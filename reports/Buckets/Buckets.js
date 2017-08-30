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

    add(customer, rest) {
        this.countCustomers++;
        this.aggregate(customer).then(key => {
            this.counted++
            if (rest.length > 0) {
                if (this.buckets[key]['next'] == undefined) {
                    this.buckets[key]['next'] = rest[0]();
                }
                this.buckets[key]['next'].add(customer, _.slice(rest, 1));
            }
        }).catch(() => {
            this.error();
        });
    }

}