var pg    = require('pg'),
    async = require('async'),
    config = require('../lib/config.js')
    ;

exports.fuel_data = function(req, res) {
    var vehicle_id = req.params[0];
    var date_range = req.params[1] || 52;
    var ret = [];

    async.waterfall([
        function(cb) {
//            console.log("Details: " + config.db.power);
            pg.connect(config.db.fuel_consumption, function(err, client) {
                cb(err, client);
            });
        }, function(client, cb) {
            client.query('SELECT extract(epoch FROM date) as date, litresadded, penceperlitre, ' +
                                'cost, miles, partial FROM fillups WHERE vehicle = $1 ' +
                                "AND ((SELECT date FROM fillups WHERE vehicle = $2 " +
                                "ORDER BY date DESC LIMIT 1) - date) < $3 ORDER BY date ASC",
                         [ vehicle_id, vehicle_id, date_range + ' weeks' ], cb);
        }, function(result, cb) {
            var prev_miles;
            var partial_litres = 0;

            result.rows.forEach(function (row) {
                console.log("Row: " + JSON.stringify(row));
                if (prev_miles !== undefined)
                {
                    var litres = row.litresadded;
                    if (!litres)
                    {
                        console.log("ppl used");
                        litres = row.cost * 100 / row.penceperlitre;
                    }
                    console.log("litres " + litres);
                    
                    if (row.partial)
                    {
                        console.log("Partial");
                        partial_litres += litres;
                        return;
                    }
                    
                    litres += partial_litres;
                    partial_litres = 0;
                    
                    var miles_travelled = row.miles - prev_miles;
                    var mpg = miles_travelled / (litres * 0.219969157); // litres / gallon
                    
                    console.log("litres " + litres + " miles " + row.miles + " - " + prev_miles + 
                                " = " + miles_travelled + " mpg " + mpg);
                    ret.push([ parseInt(row.date) * 1000, mpg ]);
                }
                
                prev_miles = row.miles;
            });

            cb(null);
        }
    ], function (err) {
        res.contentType('json');

        if (err != null)
        {
            console.log("api/fuel_data: " + err.toString());
            res.send({ error: 'An error has occurred' });
        }
        else
            res.send({ success: true, data: ret });
    });
}

exports.power = function(req, res) {
    var ret = {};
    
    async.waterfall([
        function(cb) {
//            console.log("Details: " + config.db.power);
            pg.connect(config.db.power, function(err, client) {
                if (err)
                    console.log("Error");
//                console.log("Connect");
                cb(err, client);
            });
        }, function(client, cb) {
            client.query("SELECT 1000 * EXTRACT(epoch from timestamp) AS ts, " +
                                "watts_avg, watts_max FROM hourly " + 
                         "WHERE timestamp >= (now() - INTERVAL '6 month') AND " +
                         "timestamp < (now() - INTERVAL '2 weeks');", cb);
//            console.log("Query");
        }, function(result, cb) {
            ret.power_avg = [];
            ret.power_max = [];
            
            for (i in result.rows)
            {
                ret.power_avg.push([ result.rows[i].ts, 
                                     result.rows[i].watts_avg
                                   ]);
                ret.power_max.push([ result.rows[i].ts, 
                                     result.rows[i].watts_max
                                   ]);
            }

            cb(null);
//            console.log("Fin");
        }
    ], function(err) {
        res.contentType('json');

        if (err != null)
        {
            console.log("api/power: " + err.toString());
            res.send({ error: 'An error has occurred' });
        }
        else
            res.send({ success: true, data: ret });
    });
}
