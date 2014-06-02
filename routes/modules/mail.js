var nodemailer = require('nodemailer');

exports.send = function(option){
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: 'myartame',
            pass: 'skyl486255'
        }
    });

    var mailOptions = {
        from: '최제필 <myartame@gmail.com>',
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