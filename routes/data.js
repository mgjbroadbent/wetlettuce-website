
/*
 * data pages.
 */

var pg    = require('pg'),
    async = require('async'),
    config = require('../lib/config.js')
    ;

exports.fuel_consumption = function(req, res) {
    var params = { 
        title: 'Fuel Consumption',
        cars:  []
    };
    
    async.waterfall([
        function(cb) {
//            console.log("Details: " + config.db.fuel_consumption);
            pg.connect(config.db.fuel_consumption, function(err, client) {
                if (err)
                    console.log("Error");
                cb(err, client);
            });
//            console.log("Connect");
        }, function(client, cb) {
            client.query("SELECT id,name FROM vehicles", cb);
//            console.log("Query");
        }, function(result, cb) {
            for (i in result.rows) {
                params.cars.push({ id: result.rows[i].id, name: result.rows[i].name });
            }
            cb(null);
//            console.log("Fin");
        }
        ], function(err) {
            params.error = null;
            if (err != null)
                params.error = 'An error has occurred: ' + err;
            
            res.render('data_fuelconsumption', params);
    });
};

exports.electricity_usage = function(req, res) {
    res.render('data_electricityusage', {
        title: 'Electricity Usage'
    })
};