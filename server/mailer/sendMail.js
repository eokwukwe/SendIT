import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const email = process.env.EMAIL_NAME;
const emailPass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: email,
		pass: emailPass
	}
});

export const sendNotification = (to, subject, message, user, res) => {
	const mailOptions = {
		from: `SendIT parcel delivery services <${email}>`,
		to,
		subject,
		html: message
	};

	transport.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.status(400).json({
				status: 'error',
				message: 'Could not send email notification to user'
			});
		}
		res.status(200).json({
			status: 'success',
			message: `notification message sent to ${user}`,
			response: info.response
		});
	});
};
