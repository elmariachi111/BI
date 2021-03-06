const _ = require('lodash');
const Buckets = require('./Buckets');

module.exports = class AggregateBuckets extends Buckets {

    constructor(identifier, name) {
        super(identifier);
        this.name = name;
        this.buckets = {
            sum: 0,
            count: 0
        };
    }

    aggregate(customer) {
        return new Promise((resolve, reject) => {
            let value = this.identifier(customer);
            if (value instanceof Promise) {
                value.then(value => resolve(this.incr(value)))
                     .catch(reject)
            } else {
                if (value == false || !(_.isFinite(value) || value === 0)) {
                    reject();
                } else {
                    resolve(this.incr(value));
                }
            }
        });
    }

    incr(value) {
        this.buckets.sum += value;
        this.buckets.count++;

        return this.name;
    }

    average() {
        const avg = this.buckets.sum / this.buckets.count;
        return avg.toFixed(2);
    }

    report(depth = 0) {
        const indent = _.repeat(" ", depth);
        console.log(indent + this.name + ': ' + Math.round(this.buckets.sum) + ' (avg:' + this.average() + ', cnt:'+this.buckets.count+') errs:' + this.errs );
    }
}