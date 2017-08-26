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
}