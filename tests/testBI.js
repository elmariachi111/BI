const assert = require('chai').assert;
const Builder = require('../reports/Builder')
const BI = require('../reports/BI')

describe('BI', () => {
    describe('build', () => {
        it('should build a pipeline', () => {
            const json = {
                query: {},
                stages: [
                    {op: 'group', method: 'gender'},
                    {op: 'group', method: 'age', args: [5]},
                    {op: 'group', method: 'conversion'}
                ]
            }

            const ret = Builder(json);
            assert.instanceOf(ret, BI.ClusterBy);
            assert.lengthOf(ret.chain, 3);
        });
    })
})

