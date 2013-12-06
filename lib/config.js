
var c = require('../config.json');

console.log(JSON.stringify(c));

for (var i in c)
{
    exports[i] = c[i];
}
