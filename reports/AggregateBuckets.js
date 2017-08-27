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
        const value = this.identifier(customer);
        if (value > 0) {
            this.buckets.sum += value;
            this.buckets.count++;
        }

        return this.name;
    }

    average() {
        return Math.round(this.buckets.sum / this.buckets.count);
    }

    report(depth = 0) {
        console.log(_.repeat(" ", depth) + this.name + ': ' + Math.round(this.buckets.sum) + '(avg:' + this.average() + ', cnt:'+this.buckets.count+')' );
    }
}