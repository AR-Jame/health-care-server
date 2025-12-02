import nodemailer from "nodemailer";
import config from "../../config";

async function sendEmail(email: string, html: string) {
  // 1. Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp",
    port: 587,
    secure: false,
    auth: {
      user: config.EMAIL_SENDER.NODEMAILER_EMAIL,
      pass: config.EMAIL_SENDER.APP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: `"Health-care-server" <higibigi.ph@higibigi.com>`,
    to: "ar.jame999@gmail.com",
    subject: "Password Reset link",
    html: html,
  };

  try {
    let info = await transporter.sendMail(mailOptions);

    console.log("✅ Message sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

export default sendEmail;
