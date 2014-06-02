const ADD_COMMENT_COUNT = 5;

var UserManager = (function(){
    function User(){
        var m_Email = '';

        var m_bestCommentCount = 0;
        var m_newCommentCount = 0;

        var m_likeCheckStack = new Array();

        return {
            getEmail : function() { return m_Email; },
            setEmail : function(email) { m_Email = email; },

            initCommentCount : function(){
                m_bestCommentCount = 0;
                m_newCommentCount = 0;
            },
            getCommentCount : function(kind) {
                return (kind == "best") ? m_bestCommentCount : m_newCommentCount;
            },
            addCommentCount : function(kind) {
                (kind == "best") ? m_bestCommentCount += ADD_COMMENT_COUNT :
                    m_newCommentCount += ADD_COMMENT_COUNT;
            },
            getLikeStackLength : function() { return m_likeCheckStack.length; },
            likeCheckID : function(like_id){
                for (var i in m_likeCheckStack){
                    if (m_likeCheckStack[i] == like_id)
                        return false;
                }

                m_likeCheckStack.push(like_id);
                return true;
            }
        }
    }

    var instance;

    return {
        getInstance : function(){
            if (instance == undefined) {
                instance = new User();
            }
            return instance;
        }
    }
})();

exports.getInstance = function(){
    return UserManager.getInstance();
}