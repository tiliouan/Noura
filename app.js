const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/send-email', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    const { email, subject, message } = req.body;
    const pdf = req.files['pdf'] ? req.files['pdf'][0] : null;
    const image = req.files['image'] ? req.files['image'][0] : null;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'iamtilose@gmail.com', // your email
            pass: 'nzem hvfy aneg qngm', // your app password
        },
    });

    const attachments = [];
    if (pdf) {
        attachments.push({
            filename: pdf.originalname,
            content: pdf.buffer,
        });
    }
    if (image) {
        attachments.push({
            filename: image.originalname,
            content: image.buffer,
        });
    }

    const mailOptions = {
        from: 'iamtilose@gmail.com', // your email
        to: email,
        subject: subject,
        text: message,
        attachments: attachments,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.redirect('/success');
    });
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/public/success.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});