const util = require('util');
const moment = require('moment');
const _ = require('lodash');

module.exports = class Customer {
    constructor(doc) {
        this.doc = doc;
    }

    get gender() {
        return this.doc.sex;
    }

    get age() {
        if (!this.doc.birthday)
            return -1;

        const created = moment(this.doc.createdAt);
        return moment(created).diff(this.doc.birthday, 'years');
    }

    get id() {
        return this.doc._id;
    }

    get name() {
        return this.doc.firstName + ' '  + this.doc.lastName;
    }

    get status() {
        return this.doc.status;
    }

    get source() {
        return this.doc.source;
    }

    get createdAt() {
        return moment(this.doc.createdAt);
    }

    get zip() {
        return this.doc.address.zipCode;
    }

    get provision() {

        let provision = _.sum(_.map((this.doc.opportunities || []), opportunity => {
           const invoice =_.find(opportunity.activities, activity => {
               return /InvoiceActivity/.test(activity.type)
           });
           if (invoice) {
               return invoice.provision.cents;
           }
        }));

        return provision / 100;
    }

    findWebsiteActivities() {
        return _.flatMap(this.doc.opportunities, op =>
            _.filter(op.activities, activity => /FromWebsite/.test(activity.type) )
        )

    }
}