/**
 * Created by JP on 2014. 1. 4..
 */ 

const CONTENT_MAX = 52;

var list_position = 0;
var input_array = new Array();

var comment_index = 0;
var comment_count = 5;

$(document).ready(function(){
    comment_count += $(window).height() < 864 ? 0 : Math.round(($(window).height() - 864) / 127);
    listAdd();

    $(window).scroll(function(){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
            listAdd();
        }
    });

    var socket = io.connect();
    socket.emit('join', 'Hangang');
    socket.on('input', function(data){
        input_array.push(data);
    });

    setInterval(function(){
        if (input_array.length){
            var data = input_array.pop();
            listItemAdd(data.lecture_id, data.content, data.rate);
            $('.content-listItem').stop(true, true).animate({ 'top': '+=130' }, 1000);
        }
    }, 1500);

    $(document).on('click', '.content-listItem', function(){
        location.href = '/view?lecture_id=' + $(this).attr('alt') + "&flag=best";
    });
});

function listAdd(){
    $.get("/get?comment_index=" + comment_index + "&comment_count=" + comment_count, function(data){
        JSON.parse(data).forEach(function(comment_data, index){
            $.get("/data?lecture_id=" + comment_data.lecture_id, function(db_data){
                var tagData = JSON.parse(db_data)[0];
                var starTag = "";

                var rate = Math.floor(comment_data.rate);
                for (var i = 1 ; i <= rate ; i++){
                    starTag += '<img src="/images/star_enable.png">';
                }
                for (var i = rate + 1 ; i <= 5 ; i++){
                    starTag += '<img src="/images/star_disenable.png">';
                }
                starTag += '<span class="list-starText">' + rate + ' / 5</span>';

                var content = comment_data.content.length >= CONTENT_MAX ? comment_data.content.substr(0, CONTENT_MAX - 1) + '...' : comment_data.content;
                
                var tag = '<div class="content-listItem" style="top:' + list_position + 'px;" alt="' + comment_data.lecture_id + '"><img class="list-professorImg" src="/images/professor/' + tagData.professor + '.jpg" onError="this.src=\'/images/noimage.jpg\'"><div class="list-content">' +
                    '<span class="list-headText"><strong>' + tagData.name + '</strong></span><span class="list-subText">' +
                    tagData.professor + ' 교수님' + '</span><div class="list-line"></div><p class="list-contentText">' + content +
                    '</p><div class="list-starArea">' + starTag + '</div><div class="list-line"></div><div class="list-tagArea">' +
                    '<div class="list-tagItem"><p>' + tagData.major + '</p></div><div class="list-tagItem"><p>' + tagData.grade + '학년' +
                    '</p></div><div class="list-tagItem"><p>' + tagData.process + '</p></div></div></div></div>'
                $('#content-listArea').append(tag);
                list_position += 135;
            });
        });
        comment_index += comment_count;
        comment_count = 5;
    });
}

function listItemAdd(lecture_id, content, comment_rate){
    $.get("/data?lecture_id=" + lecture_id, function(db_data){
        var tagData = JSON.parse(db_data)[0];
        var starTag = "";

        var rate = Math.floor(comment_rate);
        for (var i = 1 ; i <= rate ; i++){
            starTag += '<img src="/images/star_enable.png">';
        }
        for (var i = rate + 1 ; i <= 5 ; i++){
            starTag += '<img src="/images/star_disenable.png">';
        }
        starTag += '<span class="list-starText">' + rate + ' / 5</span>';

        var _content = content.length >= CONTENT_MAX ? content.substr(0, CONTENT_MAX - 1) + '...' : content;

        var tag = '<div class="content-listItem content-newListItem" style="top: 0px;" alt="' + lecture_id + '">' +
            '<img class="list-professorImg" src="/images/professor/' + tagData.professor + '.jpg" onError="this.src=\'/images/noimage.jpg\'"><div class="list-content">' +
            '<span class="list-headText"><strong>' + tagData.name + '</strong></span><span class="list-subText">' +
            tagData.professor + ' 교수님' + '</span><div class="list-line"></div><p class="list-contentText">' + _content +
            '</p><div class="list-starArea">' + starTag + '</div><div class="list-line"></div><div class="list-tagArea">' +
            '<div class="list-tagItem"><p>' + tagData.major + '</p></div><div class="list-tagItem"><p>' + tagData.grade + '학년' +
            '</p></div><div class="list-tagItem"><p>' + tagData.process + '</p></div></div></div></div>'
        $('#content-listArea').append(tag);
        $('.content-newListItem').css('opacity', '0.0');
        $('.content-newListItem').stop(true, true).animate({ 'opacity': '1.0' }, 1000, 'easeInQuad', function(){
            $(this).removeClass('content-newListItem');
        });
    });
}

function logoutClick(){
    $('#logoutModal').modal('show');
}












