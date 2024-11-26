import { transporter } from "./NodeMailer";

const sendEmail = async (email: string, token: string) => {
    const logoUrl = 'https://path/logo.png'; // Replace with your logo 

    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to: email,
        subject: "Password Reset Token",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h3>Password Reset Token</h3>
                <p>Your password reset token is:</p>
                <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${token}</p>
                <p>Please use this token to reset your password.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
