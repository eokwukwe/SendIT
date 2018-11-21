import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const email = process.env.EMAIL_NAME;
const emailPass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: email,
		pass: emailPass
	}
});

export const sendNotification = (to, subject, message) => {
	const mailOptions = {
		from: `SendIT parcel delivery services <${email}>`,
		to,
		subject,
		html: message
	};

	transport.sendMail(mailOptions, error => {
		if (error) {
			return 'Could not send email notification to user';
		}
		return 'email sent to user';
	});
};
