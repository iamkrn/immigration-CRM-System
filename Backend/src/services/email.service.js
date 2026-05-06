const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const statusConfig = {
  draft:     { label: 'Draft',     color: '#6B7280', emoji: '📝' },
  submitted: { label: 'Submitted', color: '#3B82F6', emoji: '📤' },
  approved:  { label: 'Approved',  color: '#10B981', emoji: '✅' },
  rejected:  { label: 'Rejected',  color: '#EF4444', emoji: '❌' }
};

exports.sendStatusUpdateEmail = async ({ toEmail, studentName, university, course, country, newStatus }) => {

  const config = statusConfig[newStatus] || { label: newStatus, color: '#6B7280', emoji: '📋' };

  const mailOptions = {
    from: `"Visa CRM" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${config.emoji} Application Update — ${university}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">

            <div style="background:#1e293b;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Visa CRM</h1>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Application Status Update</p>
            </div>

            <div style="padding:32px;">
              <p style="margin:0 0 8px;color:#374151;font-size:15px;">Hello <strong>${studentName}</strong>,</p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                Your visa application status has been updated. Here are the details:
              </p>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">University</td>
                    <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">${university}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Course</td>
                    <td style="padding:6px 0;color:#1e293b;font-size:13px;">${course}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">Country</td>
                    <td style="padding:6px 0;color:#1e293b;font-size:13px;">${country}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-size:13px;">New Status</td>
                    <td style="padding:6px 0;">
                      <span style="background:${config.color}20;color:${config.color};font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;">
                        ${config.emoji} ${config.label}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                Please login to your student portal to view more details or contact your counsellor for any queries.
              </p>
            </div>

            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                This is an automated message from Visa CRM. Please do not reply to this email.
              </p>
            </div>

          </div>
        </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${toEmail}`);
};