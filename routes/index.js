var db = require('./modules/db');
var user = require('./modules/user').getInstance();
var mail = require('./modules/mail');

exports.index = function(req, res){
    var sql = null;
    var callback;
    if (req.query.event == "get"){
        sql = db.makeQueryString("SELECT * FROM comment ORDER BY id DESC LIMIT {0}, 5",
            [ req.session.newCommentCount ]);
        req.session.newCommentCount += 5;
    }
    else if (req.query.event == "data") {
        sql = db.makeQueryString('SELECT * FROM lecture WHERE class_number = {0}',
            [ req.query.class_number ]);
        console.log(sql)
    }
    else if (req.query.event == "mail"){
        sql = db.makeQueryString("SELECT * FROM user WHERE email = {0}", [ req.query.email ]);
        callback = function(error, result){
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
        };
    }

    if (sql != null){
        db.get(res, sql, callback);
    }
    else{
        res.render("index.html");
        req.session.newCommentCount = 0;
    }
};