/**
 * Created by add2paper on 2014. 5. 2..
 */

var db = require('./modules/db');
var user = require('./modules/user').getInstance();
var mail = require('./modules/mail');

exports.loginCheck = function(req, res, next){
    if (user.getEmail() != ''){
        next();
    }
    else {
        res.redirect('/');
    }
}

exports.login = function(req, res){
    if (user.getEmail() != ''){
        res.send(200, { flag : true });
    }
    else {
        db.get(res, db.makeQueryString("SELECT * FROM user WHERE email = {0} AND password = {1}",
            [ req.body.email, req.body.password ]), function(error, result){
            if (error == null && result.length != 0){
                user.setEmail(req.query.email);
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
        '({0}, {1})', [ req.query.email, req.query.password ]), function(error, result){
        if (error == null){
            res.render("index.html");
        }
        else {
            res.render("index.html");
        }
    })
}

exports.mail = function(req, res){
    db.get(res, db.makeQueryString("SELECT * FROM user WHERE id = {0} AND password = {1}",
        [ req.body.email, req.body.password ]), function(error, result){
        if(error == null && result.length == 0){
            var url = "http://127.0.0.1:3000/join?email=" + req.body.email + "&password=" + req.body.password;
            mail.send({
                to : req.body.email + "@hanyang.ac.kr",
                subject : "한강 가입 인증 메일입니다.",
                html : '<a href="' + url + '">' + url + '</a>'
            });
            res.send(200, { flag : true });
        }
        else{
            res.send(500, { flag : false });
        }
    })
}