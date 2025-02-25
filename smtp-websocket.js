// Get the form and send button
const form = document.getElementById('emailForm');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', async () => {
    // Collect form data
    const smtpServer = document.getElementById('smtpServer').value;
    const port = document.getElementById('port').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const toEmail = document.getElementById('toEmail').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Prepare data to be sent to the backend
    const formData = {
        smtpServer,
        port,
        username,
        password,
        toEmail,
        subject,
        message,
    };

    try {
        // Send the form data to the backend using fetch
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        // Check if the email was sent successfully
        if (data.success) {
            alert('Email sent successfully! Message ID: ' + data.messageId);
        } else {
            alert('Failed to send email: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the email.');
    }
});
