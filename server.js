const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer'); 

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.post('/send-email', upload.single('csvFile'), (req, res) => {
    const { smtpServer, port, username, password, toEmail, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
        host: smtpServer,
        port: port,
        secure: false, 
        auth: {
            user: username,
            pass: password,
        }
    });

    let mailOptions = {
        from: username,
        to: toEmail,
        subject: subject,
        text: message,
    };

    if (req.file) {
        mailOptions.attachments = [
            {
                filename: req.file.originalname,
                path: req.file.path
            }
        ];
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return res.status(500).json({ success: false, error: error.message });
        }
        console.log('Email sent: ' + info.response);
        res.json({ success: true, messageId: info.messageId });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
