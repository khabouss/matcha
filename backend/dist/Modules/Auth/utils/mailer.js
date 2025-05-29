"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmails = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
dotenv_1.default.config();
const apiInstance = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
const apiKey = sib_api_v3_sdk_1.default.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const sendEmails = (recipientEmail, verificationToken, type) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `http://localhost:3000/verify?token=${verificationToken}`; // Adjust this to your frontend URL
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
            subject: type === 'verify-account' ? 'Verify Matcha Account' : 'Reset Password',
            htmlContent: type === 'verify-account' ? verifyAccount : resetPassword,
        };
        const response = yield apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.sendEmails = sendEmails;
