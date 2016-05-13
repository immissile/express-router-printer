'use strict';
// var server = express();

var Table = require('cli-table');
var lodash = require('lodash');

module.exports = function (server, options) {
    var config  = _.assign({
        header: ['API PATH', 'API METHOD'],
        showStatistics: true,
        autoPrint: true
    }, options);

    var route, routes = [];
    server._router.stack.forEach(function(middleware) {
        if (middleware.route) {
             // routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === 'router') {
            // router middleware
            middleware.handle.stack.forEach(function(handler){
                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    var table = new Table({
        head: config.header
        //colWidths: [100, 200]
    });

    routes.forEach(function(r) {
        var _method = null;
        for (var k in r.methods) {
            _method = k;
        }
        var _rou = [r.path, _method.toUpperCase()]
        table.push(_rou);
    });

    if (config.showStatistics) {
        table.push(['Total Number', routes.length]);
    }

    if (config.autoPrint) {
        console.log(table.toString());
    } else {
        return table;
    }
};


/*
table.push(
    ['First value', 'Second value'],
    ['First value222', 'Second value222']
);
*/



