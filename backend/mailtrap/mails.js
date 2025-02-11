import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./mailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerficationEmail = async (email, verificationToken) => {
    const recipient = [
        {
            email,
        },
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ),
            category: "Email Verification",
        });
        console.log("Verification Email sent sucessfully", response);
    } catch (error) {
        console.log("Error in sending Verification Email:", error);
        throw new Error("Error in sending Verification Email:", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "7e1336ef-89ef-4fbd-af68-0b0feb11fc30",
            template_variables: {
                company_info_name: "UAuth company",
                name,
            },
        });

        console.log("Welcome email sent successfully:", response);
        
    } catch (error) {
        console.log("Error sending Welcome email:", error);
        throw new Error("Error in sending Welcome Email:", error);
    }   
};

export const sendForgotPasswordEmail = async (email, resetURL) => {
    const recipient = [ { email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset"
        })
        console.log("Forgot password email sent successfully", response);
        
    } catch (error) {
        console.log("Error sending Forgot password email:",error);
        throw new Error("Error sending Forgot password email")
    }
}

export const sendResetPasswordSuccessEmail = async (email) => {
    const recipient = [ { email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset success"
        })

        console.log("Password reset mail sent successfull", response);
        
    } catch (error) {
        console.log("Error sending Password reset mail",error);
        throw new Error("Error sending Password reset mail")
    }
}