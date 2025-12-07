/**
 * Email Report Sender
 * 
 * Sends test execution reports via email using nodemailer.
 * Can be run after test execution to notify stakeholders.
 * 
 * Usage:
 *   node scripts/sendEmailReport.js
 * 
 * Environment variables required:
 *   - SMTP_HOST: SMTP server host
 *   - SMTP_PORT: SMTP server port
 *   - SMTP_USER: SMTP username/email
 *   - SMTP_PASS: SMTP password or app password
 *   - EMAIL_RECIPIENTS: Comma-separated list of recipients
 */

require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  from: process.env.SMTP_USER,
  recipients: (process.env.EMAIL_RECIPIENTS || '').split(',').map(e => e.trim()).filter(e => e),
  subject: `Cypress Test Report - ${new Date().toLocaleDateString()}`,
  reportPath: path.join(__dirname, '../cypress/reports/html/report.html'),
  screenshotsPath: path.join(__dirname, '../cypress/screenshots'),
  allureReportPath: path.join(__dirname, '../allure-report')
};

/**
 * Get test summary from mochawesome report
 */
function getTestSummary() {
  const reportJsonPath = path.join(__dirname, '../cypress/reports/mochawesome.json');
  
  if (fs.existsSync(reportJsonPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
      return {
        total: report.stats.tests || 0,
        passed: report.stats.passes || 0,
        failed: report.stats.failures || 0,
        pending: report.stats.pending || 0,
        skipped: report.stats.skipped || 0,
        duration: report.stats.duration || 0,
        passPercent: report.stats.passPercent || 0
      };
    } catch (error) {
      console.error('Error reading report:', error.message);
    }
  }
  
  return {
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
    duration: 0,
    passPercent: 0
  };
}

/**
 * Get failed test screenshots
 */
function getFailedScreenshots() {
  const screenshots = [];
  
  if (fs.existsSync(config.screenshotsPath)) {
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.png')) {
          screenshots.push({
            filename: file,
            path: filePath,
            cid: file.replace(/[^a-zA-Z0-9]/g, '_')
          });
        }
      });
    };
    walkDir(config.screenshotsPath);
  }
  
  return screenshots.slice(0, 10); // Limit to 10 screenshots
}

/**
 * Generate HTML email body
 */
function generateEmailBody(summary, screenshots) {
  const statusColor = summary.failed > 0 ? '#dc3545' : '#28a745';
  const statusText = summary.failed > 0 ? 'FAILED' : 'PASSED';
  
  let screenshotHtml = '';
  if (screenshots.length > 0) {
    screenshotHtml = `
      <h3>Failed Test Screenshots</h3>
      ${screenshots.map(s => `
        <div style="margin: 10px 0;">
          <p><strong>${s.filename}</strong></p>
          <img src="cid:${s.cid}" style="max-width: 800px; border: 1px solid #ddd;" />
        </div>
      `).join('')}
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .status { font-size: 24px; font-weight: bold; color: ${statusColor}; }
        .summary { background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
        .summary-item { display: inline-block; margin-right: 30px; text-align: center; }
        .summary-value { font-size: 28px; font-weight: bold; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .pending { color: #ffc107; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cypress Test Execution Report</h1>
          <p class="status">Status: ${statusText}</p>
          <p>Execution Date: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
          <h2>Test Summary</h2>
          <div class="summary-item">
            <div class="summary-value">${summary.total}</div>
            <div>Total Tests</div>
          </div>
          <div class="summary-item">
            <div class="summary-value passed">${summary.passed}</div>
            <div>Passed</div>
          </div>
          <div class="summary-item">
            <div class="summary-value failed">${summary.failed}</div>
            <div>Failed</div>
          </div>
          <div class="summary-item">
            <div class="summary-value pending">${summary.pending}</div>
            <div>Pending</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${(summary.duration / 1000).toFixed(2)}s</div>
            <div>Duration</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${summary.passPercent.toFixed(1)}%</div>
            <div>Pass Rate</div>
          </div>
        </div>
        
        ${screenshotHtml}
        
        <div class="footer">
          <p>This is an automated email from Cypress Test Automation Framework.</p>
          <p>For detailed reports, please check the attached files or CI/CD artifacts.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email report
 */
async function sendEmailReport() {
  // Validate configuration
  if (!config.smtp.auth.user || !config.smtp.auth.pass) {
    console.error('Error: SMTP credentials not configured.');
    console.error('Please set SMTP_USER and SMTP_PASS environment variables.');
    process.exit(1);
  }
  
  if (config.recipients.length === 0) {
    console.error('Error: No email recipients configured.');
    console.error('Please set EMAIL_RECIPIENTS environment variable.');
    process.exit(1);
  }
  
  console.log('Preparing email report...');
  
  // Get test summary
  const summary = getTestSummary();
  console.log('Test Summary:', summary);
  
  // Get screenshots
  const screenshots = getFailedScreenshots();
  console.log(`Found ${screenshots.length} screenshots`);
  
  // Create transporter
  const transporter = nodemailer.createTransport(config.smtp);
  
  // Verify connection
  try {
    await transporter.verify();
    console.log('SMTP connection verified');
  } catch (error) {
    console.error('SMTP connection failed:', error.message);
    process.exit(1);
  }
  
  // Prepare attachments
  const attachments = [];
  
  // Add HTML report if exists
  if (fs.existsSync(config.reportPath)) {
    attachments.push({
      filename: 'test-report.html',
      path: config.reportPath
    });
  }
  
  // Add screenshots as embedded images
  screenshots.forEach(screenshot => {
    attachments.push({
      filename: screenshot.filename,
      path: screenshot.path,
      cid: screenshot.cid
    });
  });
  
  // Prepare email
  const mailOptions = {
    from: config.from,
    to: config.recipients.join(', '),
    subject: `${summary.failed > 0 ? '❌' : '✅'} ${config.subject} - ${summary.passed}/${summary.total} Passed`,
    html: generateEmailBody(summary, screenshots),
    attachments
  };
  
  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Recipients:', config.recipients.join(', '));
  } catch (error) {
    console.error('Failed to send email:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  sendEmailReport().catch(console.error);
}

module.exports = { sendEmailReport };
