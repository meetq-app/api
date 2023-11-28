const nodemailer = require('nodemailer');

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text: html,
    });
  } catch (e) {
    console.error(e);
  }
}
