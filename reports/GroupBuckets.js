const _ = require('lodash');
const Buckets = require('./Buckets');

module.exports = class GroupBuckets extends Buckets {

    report(depth=0) {
        _.each(this.buckets, (aggregate, key) => {
            console.log(_.repeat(" ", depth) + key + ': ' + aggregate.value);
            if (aggregate.next != null) {
                aggregate.next.report(depth + 2);
            }
        });
    }

    aggregate(customer) {
        let key = this.identifier(customer);
        if (key === false) {
            this.errs++;
            return false;
        }
        if (this.buckets[key] == undefined) {
            this.buckets[key] = {
                value: 0
            };
        }

        this.buckets[key].value++;
        return key;
    }

    report(depth=0) {
        _.each(this.buckets, (aggregate, key) => {
            console.log(_.repeat(" ", depth) + key + ': ' + aggregate.value);
            if (aggregate.next != null) {
                aggregate.next.report(depth + 2);
            }
        });
    }

}