// utils/emailService.js
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport.
// Here we're using Gmail as an example.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,       // 465 for SSL (secure), or 587 for TLS (non-secure)
  secure: true,    // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your app-specific password
  }
});

/**
 * Send an email using the configured transporter.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text content of the email.
 * @param {string} [html] - Optional HTML content for the email.
 * @returns {Promise} - Resolves when the email is sent.
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    // Define the email options.
    // console.log('EMAIL_USER:', process.env.EMAIL_USER);
    // console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

    let info = await transporter.sendMail({
      from: `"DoctorSearch" <${process.env.EMAIL_USER}>`, // Sender address and name.
      to,       // Recipient address.
      subject,  // Subject line.
      text,     // Plain text body.
      html      // HTML body (optional).
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
