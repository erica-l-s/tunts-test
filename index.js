const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // way to credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

async function readSheets() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1npbD3YOJQpfNSCnI0Jrj-rZk1VMBwtcPIQh_bg68fTM',
            range: 'engenharia_de_software!A3:H', // Specify the range of cells you want to read
        });

        const rows = response.data.values;
        if (rows.length) {
            console.log('Sheet data:');
            rows.map(row => {
                console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}, ${row[6]}, ${row[7]}`);
            });
        } else {
            console.log('Data not found.');
        }
    } catch (error) {
        console.error('Error to read the sheet:', error);
    }
}

readSheets();