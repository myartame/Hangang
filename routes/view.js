/**
 * Created by add2paper on 2014. 4. 15..
 */
var db = require('./modules/db');
var mail = require('./modules/mail');

exports.index = function(req, res){
    if (req.query.event == "get"){
        getComment(res, req.query);
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

        var query = db.makeQueryString('SELECT * FROM lecture WHERE class_number = {0}', [req.query.class_number]);
        db.get(res, query, function(error, result){
            var view_data = (error == null) ? result : {};
            view_data[0]['flag'] = req.query.flag;
            res.render("view.html", { data: view_data });
        });
    }
}

exports.input = function(req, res){
    db.get(res, db.makeQueryString('INSERT INTO comment (email, content, class_number, ' +
        'rate, like_count, dis_count) VALUES ({0}, {1}, {2}, {3}, 0, 0)',
        [ req.session.user_id || '', req.body.content, req.body.class_num, req.body.rate ]), function(error, result){
            if (error == null){
                db.get(res, "UPDATE lecture SET comment_count = comment_count + 1, rate = ((rate * comment_count) + "
                  + req.body.rate + ") / (comment_count + 1) WHERE class_number = " + req.body.class_num);
                }
            });
}

function getComment(req, res, query){
    var sql = "SELECT * FROM comment WHERE class_number = " + query.class_num;
    if (query.flag == "best") {
        sql += " ORDER BY like_count DESC";
        sql += " LIMIT " + req.session.bestCommentCount + ", " + 5;
        req.session.bestCommentCount += 5;
    }
    else {
        sql += " ORDER BY id DESC";
        sql += " LIMIT " + req.session.newCommentCount + ", " + 5;
        req.session.bestCommentCount += 5;
    }
    db.get(res, sql);
}

function likeClickListener(req, res){
    var comment_id = parseInt(req.query.id);

    if (user.getLikeStackLength() == 0) {
        db.get(res, db.makeQueryString("SELECT * FROM user_like WHERE email = {0}", [ /*user.getEmail()*/ "myartame" ]),
            function (error, result) {
                if (error == null) {
                    for (var i in result) {
                        user.likeCheckID(result[i].comment_id);
                    }
                }
            }
        );
    }

    if(user.likeCheckID(comment_id)) {
        db.get(res, db.makeQueryString("INSERT INTO user_like (email, comment_id) VALUES ({0}, {1})",
            [ /*user.getEmail()*/"myartame", req.query.id ]), function(){});
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