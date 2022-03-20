const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.fullname.split(' ')[0]; //Taking the first name of the user in other to personalize the email
        this.url = url;
        this.from = `Sponsorfy Inc. <${process.env.EMAIL_FROM}>`
    }

    createNewTransport() {
        if(process.env.NODE_ENV === 'production') {
            // Create transporter using Sendgrid;
            return;
        };

      const{EMAIL_HOST,EMAIL_PORT,EMAIL_USERNAME,EMAIL_PASSWORD} = process.env;
       return  nodemailer.createTransport({
            host: EMAIL_HOST ,
            port: EMAIL_PORT,
            auth:{
                user:EMAIL_USERNAME,
                pass:EMAIL_PASSWORD
            }
    
    })
    }

   async send(template, subject) {
        // 1) Render HTML for the email
            const html = `
                <div>Hello from the other side...</div>
            `
        // 2) Define the email options
           const mailOptions = {
            from:this.from,
            to:this.to,   
            subject,
            html,
            text:htmlToText.fromString(html)
        }

        // 3) Create a transport and send email

        // await transporter.sendMail(mailOptions)

        await this.createNewTransport().sendMail(mailOptions)

}

   async sendWelcome() {
       await this.send('welcome', 'Welcome to the Sponsorfy Family! You are only a few points away from going abroad.')
 }
}
