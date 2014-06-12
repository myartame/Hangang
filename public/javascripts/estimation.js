/**
 * Created by JP on 2013. 12. 23..
 */

var mouseflag = true;

$(document).ready(function(){
    var container = document.querySelector('#content-itemArea');
    var msnry = new Masonry( container, {
        columnWidth: 210,
        itemSelector: '.content-item',
        gutter: 20,
    });

    $('.content-item').hover(function(){
        $(this).children('.item-hoverBox').stop(true, true).animate({"opacity": "0.7"}, 300);
        $(this).children('.item-hoverSearch').stop(true, true).animate({"opacity": "0.7", "left": "30%"}, 300);
    }, function(){
        $(this).children('.item-hoverBox').stop(true, true).animate({"opacity": "0"}, 300)
        $(this).children('.item-hoverSearch').stop(true, true).animate({"opacity": "0", "left": "55%"}, 300);
    });

    $('.content-item').click(function(){
        location.href = '/view?lecture_id=' + $(this).attr("alt") +
            "&flag=best";
    });

    $('#form-search').keydown(function(event){
        if (event.keyCode == 13){
            if ($(this).val() != ''){
                var url = '/estimation?name=' + SpaceRemove($(this).val()) + "&major=" + $('#majorBtn .dropdown-text').text() +
                    "&grade=" + $('#gradeBtn .dropdown-text').text().replace("학년", '') +
                    "&process=" + $('#processBtn .dropdown-text').text();
                location.replace(url);
            }
            else
                alert("교수 혹은 과목을 입력해주세요!");
            return false;
        }
    });
    $('#form-search-button').click(function(){
        if ($('#form-search').val() != ''){
            var url = '/estimation?name=' + SpaceRemove($('#form-search').val()) + "&major=" + $('#majorBtn .dropdown-text').text() +
                    "&grade=" + $('#gradeBtn .dropdown-text').text().replace("학년", '') +
                    "&process=" + $('#processBtn .dropdown-text').text();
            location.replace(url);
        }
        else
            alert("교수 혹은 과목을 입력해주세요!");
        return false;
    });

    $('.dropdown-major li a').click(function(){
        $('#majorBtn .dropdown-text').text($(this).text());
    })

    $('.dropdown-grade li a').click(function(){
        $('#gradeBtn .dropdown-text').text($(this).text());
    })

    $('.dropdown-process li a').click(function(){
        $('#processBtn .dropdown-text').text($(this).text());
    })
});