let ws;

function openWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
        console.log('Server response:', event.data);
        alert(event.data);
        ws.close();
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Failed to send email. Check console for more details.');
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed.');
    };
}

document.getElementById('sendButton').addEventListener('click', async () => {
    const smtpServer = document.getElementById('smtpServer').value;
    const port = parseInt(document.getElementById('port').value, 10);
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const toEmail = document.getElementById('toEmail').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const emailData = {
        smtpServer,
        port,
        username,
        password,
        toEmail,
        subject,
        message
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Sending email data...');
        ws.send(JSON.stringify(emailData));
    } else {
        console.error('WebSocket not open. Please try again later.');
    }
});

openWebSocket(); // Open the WebSocket connection when the page loads.
