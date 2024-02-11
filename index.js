const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // way to credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Function to calculate the student situation
function calculateSituation(media, absence, totalAulas) {
   
    if (absence > 0.25 * totalAulas) {
        console.log("Reprove to absence");
        return { situation: "Reprove to absence", naf: 0 };
    }
    else if (media <= 50 || media < 70 ) {
        const naf = Math.max( 50 + media )/2; //calculate the naf to know final notes of each students
        console.log("Final exams");
        console.log(`Notes to final approved: ${naf}`);
        return { situation: "Final exams", naf};
 
 }else if (media >= 70) {
        console.log("Approved");
        return { situation: "Approved", naf: 0 };
    } else {
        console.log("Reprove to note");
        return { situation: "Reprove to note", naf: 0 };
    }
}

// Function to update cells 
async function updateSheet(data) {
    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: '1npbD3YOJQpfNSCnI0Jrj-rZk1VMBwtcPIQh_bg68fTM',
            range: 'engenharia_de_software!G4:H', // Specify the range of cells to update
            valueInputOption: 'RAW',
            resource: { values: data }
        });

        console.log(`${response.data.updatedCells} cells updated.`);
    } catch (error) {
        console.error('Erros to update cells:', error);
    }
}

// Function to read the sheets and calculate all the student's notes to notify your status
async function readSheets() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1npbD3YOJQpfNSCnI0Jrj-rZk1VMBwtcPIQh_bg68fTM',
            range: 'engenharia_de_software!A4:H', // Specify the range of cells you want to read
        });

        const rows = response.data.values; // take the informations about the sheets row
                 
        if (rows.length) { // verify the rows 
            const totalclass = 60;
            const data = [];
            console.log('Sheet data:');

            rows.forEach(row => { //take for each students and calculate the media and absence to pass the students status
                const name = row[1];
                const p1 = parseFloat(row[3]);
                const p2 = parseFloat(row[4]);
                const p3 = parseFloat(row[5]);
                const media = Math.ceil((p1 + p2 + p3) / 3);
                const absence = parseInt(row[2]);
                console.log(`Student's situation ${name}:`);
                console.log('Media of student is: ' + parseFloat(media))
                const { situation, naf } = calculateSituation(media, absence, totalclass);
                data.push([situation, naf]);
                console.log(situation)
                console.log("-------------------------");
               
              
                return situation
                
            });
            await updateSheet(data) // update the sheet with all students informations 
        } else {
            console.log('Not data was found in sheet');
        }
       
    } catch (error) {
        console.error('Error to read the sheet:', error);
    }
}

readSheets();