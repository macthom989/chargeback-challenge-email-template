const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Read the HTML template
const templatePath = path.join(__dirname, 'email-template.html');
let emailTemplate = fs.readFileSync(templatePath, 'utf8');

// Sample data to replace variables
const emailData = {
    MERCHANT_NAME: 'Thơm Mạc',
    MERCHANT_EMAIL: 'macthom@nail98.com',
    WHMCS_ID: '26121998',
    CARD_NUMBER: 'xx9999',
    AMOUNT: '$36.05',
    TRANSACTION_DATE: '06/28/2024',
    RESPONSE_BY: '11/01/2024',
    RESPONSE_PORTAL_URL: 'https://dev.gci-payment-gateway/chargeback-challenge/id',
    SUPPORT_EMAIL: 'contact@fastboy.net',
    SUPPORT_PHONE: '(832) 968-6668',
    CURRENT_YEAR: new Date().getFullYear()
};

// Replace variables in the template
Object.keys(emailData).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    emailTemplate = emailTemplate.replace(regex, emailData[key]);
});

// Create a test account using Ethereal
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "3358de4d57bf5a",
            pass: "7ffd678cbb10aa"
        }
    });

    // Message object
    let message = {
        from: `Phát Nguyễn - <${emailData.SUPPORT_EMAIL}>`,
        to: `${emailData.MERCHANT_NAME} <${emailData.MERCHANT_EMAIL}>`,
        subject: `CHARGEBACK CASE ${emailData.WHMCS_ID}#`,
        html: emailTemplate
    };


    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});

// // Log the email content to the console (for demonstration purposes)
console.log('Email Content:');
console.log(emailTemplate);