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
            let ratio = (aggregate.value * 100) / this.counted;
            console.log(_.repeat(" ", depth) + key + ': ' + aggregate.value + ' ('+Math.round(ratio)+'%)');
            if (aggregate.next != null) {
                aggregate.next.report(depth + 2);
            }
        });
        if (this.errs > 0) {
            let ratio = (this.errs * 100) / this.countCustomers;
            console.log(_.repeat(" ", depth) + 'errs: ' + this.errs +  ' ('+Math.round(ratio)+'%)')
        }
    }

}