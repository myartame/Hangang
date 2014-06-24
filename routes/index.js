var db = require('./modules/db');
var mail = require('./modules/mail');

exports.index = function(req, res){
    res.render("index.html");
};

exports.get = function(req, res){
    //var sql = db.makeQueryString("SELECT * FROM comment ORDER BY id DESC LIMIT {0}, {1}",
    //    [ req.query.comment_index, req.query.comment_count ]);
    var sql = "SELECT * FROM comment ORDER BY id DESC LIMIT " + req.query.comment_index +
        ", " + req.query.comment_count;
    console.log("SQL : " + sql);
    db.get(res, sql);
}

exports.data = function(req, res){
    var sql = 'SELECT * FROM lecture WHERE id = ' + req.query.lecture_id;
    db.get(res, sql);
}

exports.passwordGet = function(req, res){
    var sql = db.makeQueryString("SELECT * FROM user WHERE email = {0}", [ req.query.email ]);
    db.get(res, sql, function(error, result){
        if (error == null && result.length != 0){
            mail.send({
                to : req.query.email + "@hanyang.ac.kr",
                subject : "한강 비밀번호입니다.",
                text : "비밀번호 : " + result[0].password
            });
            res.send({ flag : true });
        }
        else{
            res.send({ flag : false });
        }
    });
}