var inputArray = inputArray || new Array();
var inputAlertContext = [
	"과목명을", "교수명을", "분류를", "자료를"
];

$(document).ready(function(){
	$('.content-coverWrap').hover(function(){
        $(this).children('.content-listCover').stop(true, true).animate({"opacity": "0.7"}, 300);
        $(this).children('.content-downloadBtn').stop(true, true).animate({"opacity": "0.7"}, 300);
    }, function(){
        $(this).children('.content-listCover').stop(true, true).animate({"opacity": "0"}, 300)
        $(this).children('.content-downloadBtn').stop(true, true).animate({"opacity": "0"}, 300);
    });

	$('#uploadDialog').hide().change(function() { 
		$('#uploadLargeInput').val($(this).val().split('\\').pop());
	});

	$('.content-listCheatItem').click(function(){
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









