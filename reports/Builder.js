const BI = require('./BI');
const _ = require('lodash');

module.exports = (json) => {

    let ret = BI.query(json.query || {});

    _.each(json.stages, stage => {
        let aggregate = BI[stage.method].apply(BI, stage.args || []);
        ret = ret[stage.op].call(ret, aggregate)
    })

    return ret;
}