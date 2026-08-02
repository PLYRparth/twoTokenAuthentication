const { Resend } = require('resend');

const sendPasswordResetOTP = async (email, otp) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('CRITICAL: RESEND_API_KEY is not defined in .env file!');
            throw new Error('Email service is not configured properly.');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const { data, error } = await resend.emails.send({
            from: `App <${fromEmail}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Use the OTP below to proceed.</p>
                    <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="font-size: 12px; color: #777;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
        
        console.log('Email sent successfully:', data);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendPasswordResetOTP };
