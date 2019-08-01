'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = function(to, subject, body){

    const recipients = to.split(',');
	const mailOptions = {
        from: process.env.EMAIL_FROM,
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


    for (var i=0; i<recipients.length; i++) {

        const recipient = recipients[i].trim();
        const options = {
            ...mailOptions,
            to: recipient
        }

        // send mail with defined transport object
        transporter.sendMail(options, (error, info) => {

            if (error) {
                return console.log(error);
            }
            console.log('Message sent to %s: %s', recipient, info.messageId);

        });
    }
    
};