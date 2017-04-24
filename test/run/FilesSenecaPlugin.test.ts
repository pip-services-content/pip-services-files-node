let _ = require('lodash');
let assert = require('chai').assert;

let pluginOptions = {
    logger: {
        level: 'debug'
    },
    'persistence': {
        type: 'memory'
    },
    service: {
        connection: {
            protocol: 'none'
        }
    }
};

suite('FilesSenecaPlugin', ()=> {
    let seneca;

    suiteSetup((done) => {
        seneca = require('seneca')({ strict: { result: false } });

        // Load Seneca plugin
        let plugin = require('../../src/container/FilesSenecaPlugin');
        seneca.use(plugin, pluginOptions);

        seneca.ready(done);
    });

    suiteTeardown((done) => {
        seneca.close(done);
    });

    test('Ping', (done) => {
        seneca.act(
            {
                role: 'files',
                cmd: 'get_files_by_filter' 
            },
            (err, page) => {
                assert.isNull(err);
                assert.isObject(page);
                done();
            }
        );
    });
});