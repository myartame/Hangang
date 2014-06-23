var nodemailer = require('nodemailer');

exports.send = function(option){
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: 'hyurecord',
            pass: 'skyl4437'
        }
    });

    var mailOptions = {
        from: '휴레코드 <hyurecord@gmail.com>',
        to: option.to,
        subject: option.subject,
        text: option.text,
        html: option.html
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error){
            console.log(error);
        } else {
            console.log("Message sent : " + response.message);
        }
        smtpTransport.close();
    });
}