const con = require('../db');
const _ = require('lodash');

const Customer = require('./Customer');
const Buckets = require('./Buckets');

const queryCustomers = function(query, adder) {

    let buckets = new Buckets(adder);

    return new Promise((resolve, reject) => {
        con.then(db => {
            const col = db.collection('customers');
            const cursor = col.find(query);
            cursor.forEach(doc => {
                buckets.add(new Customer(doc))
            }, () => {
                resolve(buckets);
            });
        })
    });
}

module.exports = {
    age: function(query) {
        return queryCustomers(query, function(customer) {
            if (customer.age > 0) {
                let ageRange = (Math.floor(customer.age / 10)) * 10;
                this.buckets[ageRange]++;
            } else {
                this.error();
            }
        });
    }
}

