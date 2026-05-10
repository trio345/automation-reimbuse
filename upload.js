const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function uploadLatestScreenshot() {
    const credentials = JSON.parse(
        Buffer.from(process.env.GDRIVE_CREDENTIALS_DATA, 'base64').toString()
    );

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({
        version: 'v3',
        auth,
    });

    const files = fs
        .readdirSync('.')
        .filter(file => file.startsWith('screenshot-') && file.endsWith('.png'));

    if (files.length === 0) {
        throw new Error('No screenshot file found');
    }

    const filePath = files[0];

    console.log('Uploading:', filePath);

    const response = await drive.files.create({
        requestBody: {
            name: path.basename(filePath),
            parents: ['1b9bbjeyrbbHVJFVj-HqPtoQATUJmuGDf'],
        },
        media: {
            mimeType: 'image/png',
            body: fs.createReadStream(filePath),
        },
    });

    console.log('Uploaded File ID:', response.data.id);
}

uploadLatestScreenshot().catch(console.error);