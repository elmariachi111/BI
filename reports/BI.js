const con = require('../db');
const _ = require('lodash');
const Geohash = require('latlon-geohash');

const Customer = require('./Customer');
const Buckets = {
    GroupBuckets: require('./Buckets/GroupBuckets'),
    AggregateBuckets: require('./Buckets/AggregateBuckets')
};

class ClusterBy {

    constructor() {
        this.chain = [];
        this._query = {};
    }

    /**
     * @param query function returning a promise on an iterable (cursor)
     * @return Promise
     */
    execute() {
        return new Promise( (resolve, reject) => {
            con.then(db => {
                const cursor = db.collection('customers').find(this._query);

                let firstBucket = this.chain[0]();
                let rest = _.slice(this.chain, 1);

                const process = (doc => {
                    let customer = new Customer(doc);
                    firstBucket.add(customer, rest).then(() => {
                        cursor.next().then(process).catch(() => {
                            resolve(firstBucket)
                        });
                    }).catch(err => {
                        console.dir(err);
                    });
                })
                cursor.next().then(process) //catch: 0 rows found ;)
            });
        });
    }

    query(query) {
        this._query = query;
        return this;
    }

    group(identifier) {
        this.chain.push(
            function() {
                return new Buckets.GroupBuckets(identifier)
            });
        return this;
    }

    sum(identifier, name) {
        this.chain.push(function() {
            return new Buckets.AggregateBuckets(identifier, name)
        });
        return this;
    }
}

module.exports = {
    ClusterBy,
    age: function(splits=10) {
        return function(customer) {
            let age = customer.age;
            let ageRange = 0;
            if (age > 0) {
                if (splits == 10) {
                    ageRange = (Math.floor(age / 10)) * 10;
                } else {
                    ageRange = Math.floor(age / 10) * 10 + ( (age / 10) - Math.floor(age/10) >= 0.5 ? 5 : 0)
                }
                return ageRange;
            } else {
                return false;
            }
        }
    },
    yearkw: function() {
        return (customer) => customer.createdAt.format('YYYY/ww');
    },
    gender: function() {
        return (customer) => customer.gender;
    },
    source: function() {
        return (customer) => customer.source;
    },
    provision: function() {
        return (customer) => customer.provision;
    },
    status: function() {
        return (customer) => customer.status;
    },
    conversion: function() {
        return (customer) => {
            if (customer.status == 'lost') {
                return 'lost';
            } else if(_.includes(['won', 'cleared'], customer.status)) {
                return 'won';
            } else {
                return 'progress';
            }
        }
    },
    zip1: function() {
        return (customer) => {
            let zip = customer.zip;
            if (zip == null || zip.length == 0) {
                return false;
            } else {
                return zip.substr(0,1)
            }
        }
    },
    location: function() {
        return (customer) => {
            return new Promise( (resolve, reject) => {
                con.then(db => {
                    let ids = _.map(customer.findWebsiteActivities(), 'action.oid');
                    if (ids.length == 0)
                        resolve(false);

                    db.collection('actions').findOne({_id: ids[0]}, (err, action) => {
                        if (err) {
                            return resolve(false);
                        }
                        if (!action || !action.query) {
                            return resolve(false)
                        }
                        let query = action.query;
                        if (query.lat != undefined) {
                            let geohash = Geohash.encode(query.lat,query.lon, 3);
                            return resolve(geohash);
                        }
                    });
                    //reject(); //nothing found.
                }).catch(err => {
                    console.dir(err);
                });
            })
        }
    }
};

