const { Router } = require('express');
const nodemailer = require('nodemailer');
const router = Router();

// Set up email credentials from .env file
const emailUser = "ahtashamulhaque50@gmail.com";
const emailPass = "pbgubqwumjuboesd";

// Create the transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'hotmail', 'yahoo', etc.
  auth: {
    user: emailUser, // Sender's email address
    pass: emailPass, // Sender's email password or app password
  },
});

// POST route to trigger sending an email
router.post('/send-email', (req, res) => {
  // Extract email details from the request body
  const { to, subject, message } = req.body;
  // Set up email options
  const mailOptions = {
    from: emailUser,   // Sender address
    to: to,            // Recipient's email address
    subject: subject,  // Subject line
    text: message,     // Plain text body
    html: `<strong>${message}</strong>`, // HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.message }); // Handle error
    }
    res.status(200).json({ message: 'Email sent successfully!', messageId: info.messageId });
  });
});


module.exports = router;
