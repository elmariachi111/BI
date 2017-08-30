const BI = require('./BI');
const _ = require('lodash');

module.exports = (json) => {

    let ret = new BI.ClusterBy()

    _.each(json.stages, stage => {
        let aggregate = BI[stage.method].apply(BI, stage.args || []);
        ret = ret[stage.op].call(ret, aggregate)
    })
    ret.query(json.query || {});

    return ret;
}