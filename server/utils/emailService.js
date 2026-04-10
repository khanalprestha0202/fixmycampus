const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendStatusUpdateEmail = async (reportTitle, reporterEmail, newStatus, reportId) => {
  try {
    const statusMessages = {
      'In Progress': 'Your report is now being worked on by our maintenance team.',
      'Resolved': 'Great news! Your maintenance report has been resolved.',
      'Closed': 'Your maintenance report has been closed.'
    };

    const message = statusMessages[newStatus];
    if (!message) return;

    await transporter.sendMail({
      from: '"FixMyCampus" <fixmycampus@gmail.com>',
      to: reporterEmail,
      subject: `Report Update: "${reportTitle}" is now ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; padding: 2rem; text-align: center;">
            <h1 style="color: #e94560; margin: 0;">🔧 FixMyCampus</h1>
          </div>
          <div style="padding: 2rem; background: #f9f9f9;">
            <h2 style="color: #333;">Report Status Update</h2>
            <p style="color: #555;">Your report <strong>"${reportTitle}"</strong> has been updated.</p>
            <div style="background: #e94560; color: white; padding: 1rem; border-radius: 8px; text-align: center; margin: 1rem 0;">
              <strong>New Status: ${newStatus}</strong>
            </div>
            <p style="color: #555;">${message}</p>
            <p style="color: #999; font-size: 0.85rem;">This is an automated notification from FixMyCampus. Please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    console.log('Email notification sent to:', reporterEmail);
  } catch (err) {
    console.log('Email notification failed (non-critical):', err.message);
  }
};

module.exports = { sendStatusUpdateEmail };