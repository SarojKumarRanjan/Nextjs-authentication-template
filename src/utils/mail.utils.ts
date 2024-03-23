import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(String(userId), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId.toString(), {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RETURN") {
      await User.findByIdAndUpdate(userId.toString(), {
        forgetPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST as string,
      port: parseInt(process.env.MAILTRAP_PORT as string),
      auth: {
        user: process.env.MAILTRAP_USER as string,
        pass: process.env.MAILTRAP_PASSWORD as string
      }
    });

    const mailOptions = {
      from: "abishek7766@gmail.com", // sender address
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line

      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${hashedToken}
            </p>`, // html body
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(`Error in sending mail: ${error.message}`);
  }
};
