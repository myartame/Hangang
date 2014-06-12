/**
 * Created by add2paper on 2014. 5. 2..
 */

var db = require('./modules/db');
var mail = require('./modules/mail');
var SHA256 = require("crypto-js/sha256");

exports.loginCheck = function(req, res, next){
    if (req.session.user_id != undefined){
        next();
    }
    else {
        res.redirect('/?login=false');
    }
}

exports.login = function(req, res){
    if (req.session.user_id != undefined){
        res.send(200, { flag : true });
    }
    else {
        db.get(res, db.makeQueryString("SELECT * FROM user WHERE email = {0} AND password = {1}",
            [ req.body.email, JSON.stringify(SHA256(req.body.password).words) ]), function(error, result){
            if (error == null && result.length != 0){
                req.session.user_id = req.body.email;
                res.send(200, { flag : true });
            }
            else{
                res.send(200, { flag : false });
            }
        });
    }
}

exports.join = function(req, res){
    db.get(res, db.makeQueryString('INSERT INTO user (email, password) VALUES ' +
        '({0}, {1})', [ req.query.email, JSON.stringify(SHA256(req.query.password).words) ]), function(error, result){
        if (error == null){
            req.session.user_id = req.query.email;
        }
        res.redirect('/');
    });
}

exports.mail = function(req, res){
    db.get(res, db.makeQueryString("SELECT * FROM user WHERE email = {0}",
        [ req.body.email ]), function(error, result){
        if(error == null && result.length == 0){
            var url = require('./modules/common').get().url + "/join?email=" + req.body.email + "&password=" + req.body.password;
            mail.send({
                to : req.body.email + "@hanyang.ac.kr",
                subject : "한학기 가입 인증 메일입니다.",
                html : '<a href="' + url + '">' + "클릭하시면 회원가입이 완료됩니다!" + '</a>'
            });
            res.send(200, { flag : true });
        }
        else{
            res.send(200, { flag : false });
        }
    });
}