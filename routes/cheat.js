/**
 * Created by add2paper on 2014. 5. 11..
 */

var fs = require('fs');
var db = require('./modules/db');

exports.index = function(req, res){
    var sql = "SELECT * FROM cheat " + (req.query.value == null ? "ORDER BY id DESC LIMIT 0, 5" :
        db.makeQueryString("WHERE professor LIKE {0} OR lecture LIKE {1}",
            [ '%' + req.query.value + '%', '%' + req.query.value + '%' ]));
    db.get(res, sql, function(error, result){
            if (error == null){
                req.session.newCommentCount = 5;
                res.render("cheat.html", { data:result });
            }
        });
}

exports.get = function(req, res){
    var sql = "SELECT * FROM cheat ORDER BY id DESC LIMIT " + req.session.newCommentCount + ", 5";
    db.get(res, sql, function(error, result){
        var data = result || {};
        if (error == null){
            req.session.newCommentCount += 5;
        }
        res.send(200, JSON.stringify(data));
    });
}

exports.upload = function(req, res){
    fs.readFile(req.files.uploadDialog.path, function(error, data){
        var filePath = __dirname + "/cheats/" + req.files.uploadDialog.name;
        fs.writeFile(filePath, data, function(error){
            if (error == null){
                var professor = req.body.uploadProfessorInput.indexOf("교수") > 0 ?
                    req.body.uploadProfessorInput.split("교수")[0] : req.body.uploadProfessorInput;
                db.get(res, db.makeQueryString("INSERT INTO cheat (email, professor, lecture, cheat, content, download_count)" +
                            " VALUES ({0}, {1}, {2}, {3}, {4}, 0)",
                    [ req.session.user_id || '', professor.replace(/^\s*|\s*$/g, ""), req.body.uploadLectureInput, req.files.uploadDialog.name, req.body.uploadContentInput ]),
                    function(error, result){
                        if (error == null){
                            res.send(200, { flag : true });
                        }
                        else {
                            res.send(200, { flag : false });
                        }
                    });
            }
            else
                res.send(200, { flag : false });
        });
    });
}

exports.download = function(req, res){
    db.get(res, db.makeQueryString("SELECT * FROM cheat WHERE id = {0}", [ req.query.id ]),
        function(error, result){
            if (error == null){
                res.download(__dirname + '/cheats/' + result[0].cheat, encodeURIComponent(result[0].cheat), function(error){
                    if (error == null){
                        db.get(res, db.makeQueryString("UPDATE cheat SET download_count = download_count + 1 WHERE id = {0}",
                            [ req.query.id ]));
                    }
                });
            }
        });
}