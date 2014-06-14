$(document).ready(function(){
    loginCheck();
    setLoginForm();
    setJoinForm();

    $('#search-form').keydown(function(event){
        if (event.keyCode == 13){
            if ($(this).val() != ''){
                location.href = '/estimation?name=' + $(this).val();
            }
            else
                alert("교수 혹은 과목을 입력해주세요!");
            return false;
        }
    });
    $('#search-button').click(function(){
        if ($('#search-form').val() != ''){
            location.href = '/estimation?name=' + $('#search-form').val();
        }
        else
            alert("교수 혹은 과목을 입력해주세요!");
        return false;
    });
});

function loginCheck(){
    $.ajax({
        type : "POST",
        url : "/login",
        contentType : "application/json",
        data : JSON.stringify({
            email : getCookie('email'),
            password : getCookie('password')
        }),
        
        success : function(data){
            if (data.flag){
                $('#navbar-loginContainer').hide();
            }
            else{
                $('#navbar-collapseContainer').hide();
            }
        }
    });
}

function setLoginForm(){
    $('.navbar-idText input').focus(function(){
        $(this).parent().parent().children('.navbar-line').css("background-color", "rgb(0, 158, 227)");
    });

    $('.navbar-idText input').focusout(function(){
        $(this).parent().parent().children('.navbar-line').css("background-color", "rgb(180, 181, 181)");
    });

    $('#joinBtn').click(function(){
        $('#joinEmailForm').removeClass("has-error");
        $('#joinPasswordForm').removeClass("has-error");
        $('#joinPasswordCheckForm').removeClass("has-error");
    });

    $('#loginBtn').click(function(){
        LoginCheck();
    });

    $('#loginInputPassword').keydown(function(event){
        if (event.keyCode == 13){
            LoginCheck();
        }
    });
}

function LoginCheck(){
    if ($('#loginInputID').val() != '' && $('#loginInputPassword').val() != ''){
        var loginData = {
            email : $('#loginInputID').val(),
            password : $('#loginInputPassword').val()
        };
        $.ajax({
            type : "POST",
            url : "/login",
            contentType : "application/json",
            data : JSON.stringify(loginData),
            success : function(data){
                if (data.flag){
                    $('#navbar-loginContainer').hide();
                    $('#navbar-collapseContainer').show();
                    setCookie('email', loginData.email);
                    setCookie('password', loginData.password);
                }
                else{
                    alert("아이디와 비밀번호를 확인해주세요!");
                    $('.navbar-line').css("background-color", "rgb(231, 56, 40)");
                }
            }
        });
    }
    else{
        if ($('#loginInputID').val() == ''){
            alert("아이디를 확인해주세요!");
            $('#emailLine').css("background-color", "rgb(231, 56, 40)");
        }
        else{
            alert("비밀번호를 확인해주세요!");
            $('#passwordLine').css("background-color", "rgb(231, 56, 40)");
        }
    }
}

function setJoinForm(){
    $('#joinMailBtn').click(function(){
        $('#joinEmailForm').removeClass("has-error");
        $('#joinPasswordForm').removeClass("has-error");
        $('#joinPasswordCheckForm').removeClass("has-error");

        var joinInputVal = $('#joinInputID').val();
        var joinInputPassword = $('#joinInputPassword').val();
        var joinInputPasswordCheck = $('#joinInputPasswordCheck').val();

        if (joinInputVal.length == 0){
            alert('아이디를 입력해주세요!');
            $('#joinEmailForm').addClass("has-error");
        }
        else if (joinInputPassword.length == 0){
            alert('비밀번호를 입력해주세요!');
            $('#joinPasswordForm').addClass("has-error");
        }
        else if (joinInputPasswordCheck.length == 0){
            alert('비밀번호를 입력해주세요!');
            $('#joinPasswordCheckForm').addClass("has-error");
        }
        else if (joinInputVal.length > 16) {
            alert('아이디는 16자 이상 설정할 수 없습니다!');
            $('#joinEmailForm').addClass("has-error");
        }
        else if (joinInputPassword != joinInputPasswordCheck){
            alert('비밀번호가 맞지 않습니다!');
            $('#joinPasswordForm').addClass("has-error");
            $('#joinPasswordCheckForm').addClass("has-error");
        }
        else{
            $.ajax({
                type : "POST",
                url : "/mail",
                contentType : "application/json",
                data : JSON.stringify({
                    email : joinInputVal,
                    password : joinInputPassword,
                }),
                success : function(data){
                    if (data.flag){
                        alert("회원가입이 완료되었습니다! 한양대 포털 사이트로 이동합니다.");
                        location.replace("https://portal.hanyang.ac.kr/port.do");
                    }
                    else{
                        alert('이미 있는 계정입니다!');
                    }
                }
            });
        }
    });

    $('#passwordFindBtn').click(function(){
        if($('#joinMail').val() == ''){
            alert("이메일을 입력해주세요!");
        }
        else{
            $.get("?event=mail&email=" + $('#joinMail').val(), function(data){
                if (data.flag == true) { 
                    alert("메일이 발송되었습니다! 메일을 확인해주세요.");
                    $('#passwordModal').modal('hide');
                }
                else {
                    alert("없는 이메일입니다. 이메일 주소를 확인해주세요.");
                }
            })
        }
    });
}

function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}