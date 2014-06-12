var db = require('./modules/db');

exports.index = function(req, res){
    var sql = db.makeQueryString("SELECT * FROM lecture WHERE (name LIKE {0} OR professor LIKE {1}) ", [ '%' + req.query.name + '%', '%' + req.query.name + '%' ]) +
        (req.query.major != "학부 선택" && req.query.major != undefined ? db.makeQueryString("AND major LIKE {0} ", ['%' + req.query.major + '%']) : '') +
        (req.query.grade != "학년 선택" && req.query.grade != undefined ? db.makeQueryString("AND grade LIKE {0} ", ['%' + req.query.grade + '%']) : '') +
        (req.query.process != "과정 구분" && req.query.process != undefined ? db.makeQueryString("AND process LIKE {0} ", ['%' + req.query.process + '%']) : '');
    console.log(sql)
    db.get(res, sql, function(error, result){
        if (error == null){
            res.render('estimationview.html', { data: result });
        }
    });
}