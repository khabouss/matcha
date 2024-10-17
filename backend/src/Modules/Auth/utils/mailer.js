require('dotenv').config();
const Brevo = require('sib-api-v3-sdk');

const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = Brevo.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmails = async (recipientEmail, verificationToken, type) => {
    const verificationUrl = `http://your-frontend-url.com/verify?token=${verificationToken}`; // Adjust this to your frontend URL
    const resetPassword = `
        <h1>Reset Password</h1>
        <p>You have requested to reset your password.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${verificationUrl}" style="background-color:#ff5733; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Reset Password</a>
        <br>
        <p>If the button doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,</p>
        <p>The Matcha Team</p>
    `;
    const verifyAccount = `
        <h1>Welcome to Matcha!</h1>
        <p>Thank you for registering an account with Matcha.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="background-color:#ff5733; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Verify Your Account</a>
        <br>
        <p>If the button doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not create this account, please ignore this email.</p>
        <p>Best regards,</p>
        <p>The Matcha Team</p>
    `;
    try {
        const sendSmtpEmail = {
            to: [{ email: recipientEmail }],
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: 'Matcha',
            },
            subject:
                type === 'verify-account'
                    ? 'Verify Matcha Account'
                    : 'Reset Password',
            htmlContent:
                type === 'verify-account' ? verifyAccount : resetPassword,
        };

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmails };
