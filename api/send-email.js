const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gserds2017@gmail.com', // Your email
        pass: 'dhqsbemjyyegsefs', // App-specific password
    },
});

// API handler function
export default async function (req, res) {
    if (req.method === 'POST') {
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
                return res.status(500).json({ error: 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Email sent successfully' });
        });
    } else {
        res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
