const sgMail = require('@sendgrid/mail')
const sendWelcomeMail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'charanch97@gmail.com',
        subject : 'Testing Email Service',
        text : `Welcome to the service ${name} . Hope you enjoy our service`

    })
}

const byeEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'charanch97@gmail.com',
        subject : 'Testing Email Service',
        text : `Welcome to the service ${name} . Hope you enjoy our service`
    })
}
module.exports = {
    sendWelcomeMail,
    byeEmail
}