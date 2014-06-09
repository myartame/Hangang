/**
 * Created by JP on 2014. 1. 4..
 */ 

const CONTENT_MAX = 43;

var list_position = 0;
var input_array = new Array();

$(document).ready(function(){
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
            listItemAdd(data.class_num, data.content);
            $('.content-listItem').stop(true, true).animate({ 'top': '+=130' }, 1000);
        }
    }, 1500);

    $(document).on('click', '.content-listItem', function(){
        location.replace('/view?class_number=' + $(this).attr('alt') + "&flag=best");
    });
});

function listAdd(){
    $.get("?event=get", function(data){
        JSON.parse(data).forEach(function(comment_data, index){
            $.get("?event=data&class_number=" + comment_data.class_number, function(db_data){
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
                
                var tag = '<div class="content-listItem" style="top:' + list_position + 'px;" alt="' + comment_data.class_number + '"><img class="list-professorImg" src="/images/professor/' + tagData.professor + '.jpg"><div class="list-content">' +
                    '<span class="list-headText"><strong>' + tagData.name + '</strong></span><span class="list-subText">' +
                    tagData.professor + ' 교수님' + '</span><div class="list-line"></div><p class="list-contentText">' + content +
                    '</p><div class="list-starArea">' + starTag + '</div><div class="list-line"></div><div class="list-tagArea">' +
                    '<div class="list-tagItem"><p>' + tagData.major + '</p></div><div class="list-tagItem"><p>' + tagData.grade + '학년' +
                    '</p></div><div class="list-tagItem"><p>' + tagData.process + '</p></div></div></div></div>'
                $('#content-listArea').append(tag);
                list_position += 135;
            });
        });
    });
}

function listItemAdd(class_number, content){
    $.get("?event=data&class_number=" + class_number, function(db_data){
        var tagData = JSON.parse(db_data)[0];
        var starTag = "";

        var rate = Math.floor(tagData.rate);
        for (var i = 1 ; i <= rate ; i++){
            starTag += '<img src="/images/star_enable.png">';
        }
        for (var i = rate + 1 ; i <= 5 ; i++){
            starTag += '<img src="/images/star_disenable.png">';
        }
        starTag += '<span class="list-starText">' + rate + ' / 5</span>';

        var _content = content.length >= CONTENT_MAX ? content.substr(0, CONTENT_MAX - 1) + '...' : content;

        var tag = '<div class="content-listItem content-newListItem" style="top: 0px;" alt="' + class_number + '">' +
            '<img class="list-professorImg" src="/images/professor/' + tagData.professor + '.jpg"><div class="list-content">' +
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












