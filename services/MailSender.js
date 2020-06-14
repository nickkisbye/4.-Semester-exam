const nodemailer = require('nodemailer');

class MailSender {

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    }

    sendMail = async (email, message) => {
        await this.transporter.sendMail({
            from: '"Tech webshop" <nicknodemailer@gmail.com>', 
            to: email, 
            subject: "New order",
            html: message
          });
    }
}

module.exports = MailSender;
