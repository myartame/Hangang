var mysql = require('mysql');

var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '486255',
    database: 'Hangang'
});

exports.get = function(res, sql, callback){
    if (callback == undefined){
        client.query(sql, function(error, result){
            var data = (error == null) ? result : {};
            res.send(200, JSON.stringify(data));
        });
    }
    else{
        client.query(sql, callback);
    }
}

exports.makeQueryString = function(sql, values){
    var makesql = sql;
    for (var i = 0 ; i < values.length ; i++){
        makesql = makesql.replace('{' + i + '}', mysql.escape(values[i]));
    }

    if (require('./common').get().debug)
        console.log("SQL : " + makesql);
    return makesql;
}