/* This mocks out the pg interface and returns pre-canned reponses to known SQL queries.
 * Then it invokes the standard start up sequence.
 */

var pg = require('pg');

var mockClient = {};
var mockRow = {};

mockClient.query = function() {
    var query = arguments[0];
    var cb = typeof arguments[1] == 'function' ? arguments[1] : arguments[2];
    
    if (query == 'SELECT id,name FROM vehicles')
    {
        var ret = Object.create(mockRow);
        ret.rows = [
            { id: 1, name: 'Ford Focus' },
            { id: 3, name: 'Peugeot 308' }
        ];
        
        cb(null, ret);
    }
    else
    {
        cb("MOCK: Unknown SQL query");
    }
}

pg.connect = function() {
    console.log("MOCK - pg.connect");
    if (typeof arguments[0] == 'function')
        arguments[0](null, Object.create(mockClient));
    else
        arguments[1](null, Object.create(mockClient));
}

require('./wetlettuce');
