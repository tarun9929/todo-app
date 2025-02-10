import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com", // Replace with your SMTP host
  port: 587,
  secure: false, // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export default async function sendMail(email, token) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Use production URL if available
  const PORT = process.env.PORT;

  const info = await transporter.sendMail({
    from: '"Team TickTask" <no-reply@yourtodolist.com>', // Sender
    to: email, // Receiver
    subject: "Verify Your Email for To-Do App ✔", // Subject line
    text: `Hello,
  
Thank you for signing up for To-Do App! To complete your registration, please verify your email address by clicking the link below:
  
${baseUrl}:${PORT}/api/users/register/${token}
  
If you did not create this account, please ignore this email.
  
Best regards,  
The TickTask Team`, // Plain text version

    html: `<p>Hello,</p>
           <p>Thank you for signing up for <strong>TickTask</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
           <p><a href="${baseUrl}:${PORT}/api/users/register/${token}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
           <p>If you did not create this account, please ignore this email.</p>
           <p>Best regards,<br>The TickTask Team</p>`, // HTML body
  });

  console.log("Message sent: %s", info.messageId);
}
