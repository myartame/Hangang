/**
 * Created by add2paper on 2014. 4. 15..
 */
var db = require('./modules/db');
var mail = require('./modules/mail');

exports.index = function(req, res){
    if (req.query.event == "get"){
        getComment(req, res);
    }
    else if (req.query.event == "like"){
        likeClickListener(req, res);
    }
    else if (req.query.event == "dis"){
        if (req.query.id != '' && req.query.content != ''){
            mail.send({
                to : "myartame@gmail.com",
                subject : "평가 신고",
                text : "id = " + req.query.id + ", content : " + req.query.content,
            });
            res.send(200, { flag : true });
        }
    }
    else{
        req.session.newCommentCount = 0;
        req.session.bestCommentCount = 0;
        likeStackInit(req, res);

        db.get(res, 'SELECT * FROM lecture WHERE id = ' + req.query.lecture_id, function(error, result){
            var view_data = view_data || {};
            if (error == null){
                view_data = result;
                view_data[0]['flag'] = req.query.flag;
            }
            res.render("view.html", { data: view_data });
        });
    }
}

exports.input = function(req, res){
    db.get(res, db.makeQueryString('INSERT INTO comment (email, content, lecture_id, rate, like_count, dis_count) VALUES ({0}, {1}, {2}, {3}, 0, 0)',
        [ req.session.user_id || '', req.body.content, req.body.lecture_id, req.body.rate ]), function(error, result){
            if (error == null){
                var sql = db.makeQueryString("UPDATE lecture SET rate = ((rate * comment_count) + "
                    + req.body.rate + ") / (comment_count + 1), comment_count = comment_count + 1 WHERE " +
                    "id = {0}", [ req.body.lecture_id ]);
                db.get(res, sql);
            }
        });
}

function getComment(req, res){
    var sql = db.makeQueryString("SELECT * FROM comment WHERE lecture_id = {0}", [ req.query.lecture_id ]);
    if (req.query.flag == "best") {
        sql += " ORDER BY like_count DESC";
        sql += " LIMIT " + req.session.bestCommentCount + ", " + 5;
        req.session.bestCommentCount += 5;
    }
    else {
        sql += " ORDER BY id DESC";
        sql += " LIMIT " + req.session.newCommentCount + ", " + 5;
        req.session.newCommentCount += 5;
    }
    db.get(res, sql);
}

function likeStackInit(req, res){
    if (req.session.likeStack == undefined){
        req.session.likeStack = new Array();
        db.get(res, db.makeQueryString("SELECT * FROM user_like WHERE email = {0}", [ /*req.session.user_id*/ "myartame" ]),
            function(error, result){
                if (error == null){
                    for (var i in result){
                        likeCheckID(req.session.likeStack, result[i].comment_id);
                    }
                }
            });
    }
}

function likeClickListener(req, res){
    if (req.session.likeStack == undefined) return;

    var comment_id = parseInt(req.query.id);
    if(likeCheckID(req.session.likeStack, comment_id)) {
        db.get(res, db.makeQueryString("INSERT INTO user_like (email, comment_id) VALUES ({0}, {1})",
            [ /*req.session.user_id*/"myartame", req.query.id ]), function(){});
    }
    else {
        res.send(200, { flag : false });
        return;
    }

    db.get(res, db.makeQueryString("UPDATE comment SET like_count = like_count + 1 WHERE id = {0}", [req.query.id]),
        function(error, result){
            if (error == null) { res.send(200, { flag : true }) }
            else { res.send(200, { flag : false }) }
        }
    );
}

function likeCheckID(likestack, like_id){
    for (var i in likestack){
        if (likestack[i] == like_id) {
            return false;
        }
    }

    likestack.push(like_id);
    return true;
}