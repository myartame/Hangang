var inputArray = inputArray || new Array();
var inputAlertContext = [
	"과목명을", "교수명을", "분류를", "자료를"
];

var comment_index = 0;
var comment_count = 5;

$(document).ready(function(){
    comment_count += $(window).height() < 864 ? 0 : Math.round(($(window).height() - 864) / 127);
    cheatAdd();
    
	$('#uploadDialog').hide().change(function() { 
		$('#uploadLargeInput').val($(this).val().split('\\').pop());
	});

    $(document).on('click', '.content-listCheatItem', function(){
        $(this).find('.list-tagItem p').text("다운로드 : " + (parseInt($(this).find('.list-tagItem').text().split("다운로드 : ")[1]) + 1));
        window.open("/cheat/download?id=" + $(this).attr('alt'));
    });

	$('#form-search').keydown(function(event){
        if (event.keyCode == 13){
            if ($(this).val() != ''){
                location.replace('/cheat?value=' + $(this).val());
            }
            else
                alert("교수 혹은 과목을 입력해주세요!");
            return false;
        }
    });
    $('#form-search-button').click(function(){
        if ($('#form-search').val() != ''){
            location.replace('/cheat?value=' + $('#form-search').val());
        }
        else
            alert("교수 혹은 과목을 입력해주세요!");
        return false;
    });

	inputArray.push($('#uploadLectureInput'));
	inputArray.push($('#uploadProfessorInput'));
	inputArray.push($('#uploadContentInput'));
	inputArray.push($('#uploadLargeInput'));

	$('.modal-btn').click(function(){
		if (uploadClick()){
			var formData = new FormData($('#modal-cheatForm')[0]);
            $.ajax({
                url: '/cheat/upload', 
                type: 'POST',
                success: completeHandler = function(data) {
                   	alert("업로드가 완료되었습니다! 감사합니다.");
					location.reload();
                },
                error: errorHandler = function() {
                    alert("업로드가 실패하였습니다.");
                    $('#uploadModal').modal('hide');
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }, 'json');
		}
	})

    $(window).scroll(function(){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
            cheatAdd();
        }
    });
});

function uploadClick(){
	var input_check_flag = true;
	inputArray.every(function(value, index){
		if (value.val() == ''){
			alert(inputAlertContext[index] + " 입력해주세요!");
			value.parent().addClass('has-error');
			input_check_flag = false;
			return false;
		}
		else {
			value.parent().removeClass('has-error');
			return true;
		}
	});
	return input_check_flag;
}

function cheatAdd(){
    $.get("/cheat/get?comment_index=" + comment_index + "&comment_count=" + comment_count, function(data){
        JSON.parse(data).forEach(function(value, index){
            var tag = '<div class="content-listCheatItem" alt="' + value.id + '"><img class="list-professorImg" src="/images/professor/' +
                value.professor + '.jpg"><div class="list-content"><span class="list-headText"><strong>' +
                '</strong></span><span class="list-subText">' + value.professor + ' 교수님</span><div class="list-line"></div><p class="list-contentText">' +
                value.content + '</p><div class="list-bottomLine"></div><div class="list-tagArea"><div class="list-tagItem"><p>다운로드 : ' +
                value.download_count + '</p></div></div></div><div class="content-coverWrap">' +
                '<div class="content-listCover"></div><img class="content-downloadBtn" src="/images/download.svg"></div></div>';
            $('#content-listArea').append(tag);
        });
        comment_index += comment_count;
        comment_count = 5;
    });
}









