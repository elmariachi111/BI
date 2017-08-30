const _ = require('lodash');
const Buckets = require('./Buckets');

module.exports = class GroupBuckets extends Buckets {

    aggregate(customer) {
        return new Promise((resolve, reject) => {
            let key = this.identifier(customer);
            if (key instanceof Promise) {
                key.then(key => resolve(this.incr(key)))
                   .catch(reject)
            } else {
                if (key === false)
                    reject();
                else
                    resolve(this.incr(key));
            }
        });
    }

    incr(key) {
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