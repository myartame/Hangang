/**
 * Created by add2paper on 2014. 6. 12..
 */

var DEBUG = true;

var common = (function(){
    return {
        debug: DEBUG,
        port: DEBUG ? 3000 : 80,
        url: DEBUG ? "http://127.0.0.1:3000" : "http://www.hyurecord.com",
    }
}());

exports.get = function(){
    return common;
}
