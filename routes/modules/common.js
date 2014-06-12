/**
 * Created by add2paper on 2014. 6. 12..
 */

var common = (function(){
    return {
        port: 3000,
        //port: 80,
        //url: "http://vps181.narru.net",
        url: "http://127.0.0.1",
    }
}());

exports.get = function(){
    return common;
}
