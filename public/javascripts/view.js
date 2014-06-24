/**
 * Created by JP on 2013. 12. 26..
 */

var star_click_count = 0;

$(document).ready(function(){
    var view_width = $('#content-mainArea').width() - $('#main-imgArea img').width();
    $('#main-commentArea').css("width", view_width);
    setMainViewWidth();
    setContentBtn();
    setImgTextCenter();
    setStarView();

    var commentArray = [ "best", "newest" ];
    commentArray.forEach(function(value){
        setCommentView(value);
    });
    $('#comment-tab a[href="#' + document.URL.split("&flag=")[1] + '"]').tab('show');
    $('#comment-tab a').click(function(){
        location.replace(document.URL.split("&flag=")[0] + "&flag=" +
            (document.URL.split("&flag=")[1] == "best" ? "newest" : "best"));        
    });

    var socket = io.connect();
    socket.emit('join', 'Hangang');

    $('#comment-btn').click(function(event){
        if ($('#comment-input').val() != ''){
            var star_rate = 0;
            for (var i = 0 ; i < 5 ; i++){
                if ($('#comment-starArea img').eq(i).attr('src') == '/images/star_enable.png')
                    star_rate++;
            }
            var input_data = {
                lecture_id: $('#professor-img').attr('alt'),
                content: $('#comment-input').val(),
                rate: star_rate
            }
            if (input_data.content.length < 20){
                alert("20자 이상 입력해주세요!");
                return false;
            }
            
            $.ajax({
                type : "POST",
                url : "/view",
                contentType : "application/json",
                data : JSON.stringify(input_data),
                success : function(data){
                    socket.emit('input', input_data);
                    alert("평가해주셔서 감사합니다!");
                    location.replace("view?lecture_id=" + input_data.lecture_id + "&flag=newest");
                }
            });
        }
    });

    $('.comment-listAddBtn').click(function(){
        setCommentView($(this).attr('alt'));    
    });
});

function setMainViewWidth(){
    $(window).bind('resize', function () { 
        var view_width = $('#content-mainArea').width() - $('#main-imgArea img').width();
        $('#main-commentArea').css("width", view_width);
    });
}

function setContentBtn(){
    $('#main-contentBtn').hover(function(){
        $(this).css({
            "background-color": "rgb(0, 158, 227)",
            "color": "white",
            "cursor": "pointer"
        });
        $('#btn-icon').css("color", "white");
    }, function(){
        $(this).css({
            "background-color": "rgba(0, 0, 0, 0.8)",
            "color": "rgb(201, 201, 202)"
        });
        $('#btn-icon').css("color", "rgb(201, 201, 202)");
    });
}

function setImgTextCenter(){
    $('#main-textView').css("margin-left", ($('#main-textArea').width() - $('#main-textView').width()) / 2);
    $('#main-textView').css("margin-top", ($('#main-textArea').height() - $('#main-textView').height()) / 2);
}

function setCommentView(value){
    $.get("?event=get&lecture_id=" + $("#professor-img").attr('alt') + "&flag=" + value, function(data){
        if (JSON.parse(data).length != 0){
            JSON.parse(data).forEach(function(item){
                var starTag = "";
                for (var i = 1 ; i <= Math.floor(item.rate) ; i++){
                    starTag += '<img src="/images/star_enable.png">';
                }
                for (var i = Math.floor(item.rate) + 1 ; i <= 5 ; i++){
                    starTag += '<img src="/images/star_disenable.png">';
                }
                var tag = '<div id="comment-listItem"><div id="comment-listContent"><div id="comment-listStar">' + starTag +
                    '</div><p id="comment-listText">' + item.content + '</p><div id="comment-listBtnArea"><div class="comment-listBtn likeBtn" alt="' + item.id +'">' +
                    '<span class="glyphicon glyphicon-thumbs-up comment-listBtnIcon"></span>좋아요<span class="badge">' + item.like_count + '</span></div>' +
                    '<div class="comment-listBtn disBtn" alt="' + item.id +'"><span class="glyphicon glyphicon-thumbs-up comment-listBtnIcon"></span>이 평가를 신고합니다</div>' +
                    '</div><div class="comment-listLine"></div></div></div>';
                $('#' + value + ' .comment-listWrap').append(tag);
            });

            $('#' + value + ' .likeBtn').click(function(){
                var _this = $(this);
                $.get('/view?event=like&id=' + $(this).attr('alt'), function(data){
                    if (data.flag == true){
                        _this.children('.badge').text(parseInt(_this.children('.badge').text()) + 1)
                    }
                    else {
                        alert("좋아요를 누르신 댓글입니다!");
                    }
                });
            });
            $('#' + value + ' .disBtn').click(function(){
                var _this = $(this);
                $.get('/view?event=dis&id=' + $(this).attr('alt') + "&content=" + $(this).parent().parent().children('p').text(), 
                    function(data){
                        if (data.flag == true){
                            alert("신고되었습니다! 확인 후 조치 취하겠습니다.");
                        }
                });
            });
        }
        else {
            $('#' + value + ' .comment-listAddBtn').remove();
        }        
    });  
}

function setStarView(){
    $('#comment-starArea img').mouseover(function(){
        var star_index = $('#comment-starArea img').index(this);

        for (var i = 0 ; i <= star_index ; i++){
            $('#comment-starArea img').eq(i).attr('src', '/images/star_enable.png');
        }
        for (var j = star_index + 1 ; j < 5 ; j++){
            $('#comment-starArea img').eq(j).attr('src', '/images/star_disenable.png');
        }
    });
    $('#comment-starArea img').mouseout(function(){
        for (var i = 0 ; i <= star_click_count ; i++){
            $('#comment-starArea img').eq(i).attr('src', '/images/star_enable.png');
        }
        for (var j = star_click_count + 1 ; j < 5 ; j++){
            $('#comment-starArea img').eq(j).attr('src', '/images/star_disenable.png');
        }
    });
    $('#comment-starArea img').click(function(){
        star_click_count = $('#comment-starArea img').index(this);
    });
}