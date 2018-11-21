import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const { EMAIL_NAME, EMAIL_PASS } = process.env;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_NAME,
    pass: EMAIL_PASS
  }
});

const sendNotification = (to, subject, message) => {
  const mailOptions = {
    from: `SendIT parcel delivery services <${EMAIL_NAME}>`,
    to,
    subject,
    html: message
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      return 'Could not send email notification to user';
    }
    return 'email sent to user';
  });
};

export default sendNotification;
