'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = function(to, subject, body){

	const mailOptions = {
        from: process.env.EMAIL_FROM, 
        to: to,
        subject: subject,
        html: body
    };

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });
};