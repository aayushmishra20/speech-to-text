// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (Gmail, Outlook, etc.)
    auth: {
        user: 'gserds2017@gmail.com', // Your email
        pass: 'dhqsbemjyyegsefs', // Your email password or app password
    },
});

// Email route
app.post('/send-email', (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: email, // Sender's email
        to: 'gserds2017@gmail.com', // Your recipient email
        subject: 'New Volunteer Submission',
        text: `You have received a new volunteer submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Email sent successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
