require("dotenv").config();

import { google } from 'googleapis';

//Google authentication here you put your credentials of google sheets API.
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // way to credentials file, here is the credential that you take of google and you get in json 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'] // here you put the google sheets API
});

const sheets = google.sheets({ version: 'v4', auth }); // here you put the version and authentication of google, they give in documentation

// Function to calculate the student situation, I used the if and else to pass this rules
function calculateSituation(media, absence, totalClass) {
   
    if (absence > 0.25 * totalClass) {
        console.log("Repprove for absence");
        return { situation: "Reprovado por falta", naf: 0 }; 
    }
    else if (media <= 50 || media < 70 ) {
        const naf = Math.ceil((50 + media )/2); //calculate the naf to know final notes of each students as requested and round to the largest whole number
        console.log("Final exams");
        console.log(`Grade to final approved: ${naf}`);
        return { situation: "Exame Final", naf}; // and pass here if the situation and naf that the students need to pass, and when they dont need, pass only 0
 
 }else if (media >= 70) {
        console.log("Approved");
        return { situation: "Aprovado", naf: 0 };
    } else {
        console.log("Repprove to grade");
        return { situation: "Reprovado por nota", naf: 0 };
    }
}

// Function to update cells
async function updateSheet(data) {
    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId:process.env.SHEEDTID, // here I pass the sheet's ID 
            range: 'engenharia_de_software!G4:H', // Here I pass the cell's name and specify the range of cells to update
            valueInputOption: 'RAW',
            resource: { values: data }
        });

        console.log(`${response.data.updatedCells} cells updated.`);
    } catch (error) {
        console.error('Error to update cells:', error);
    }
}

// Function to read the sheets and calculate all the student's notes to notify your status
async function readSheets() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId:process.env.SHEEDTID,
            range: 'engenharia_de_software!A4:H', // Specify the range of cells you want to read
        });

        const rows = response.data.values; // take the informations about the sheets row
                 
        if (rows.length) { // verify the rows 
            const totalclass = 60; //total class that is pass in the cell
            const data = [];
            console.log('Sheet data:');

            rows.forEach(row => { //take for each students and calculate the media and absence to pass the students status
                const name = row[1]; // name of each students 
                const absence = parseInt(row[2]); // absence of each students
                const p1 = parseFloat(row[3]); // grade 1
                const p2 = parseFloat(row[4]); // grade 2
                const p3 = parseFloat(row[5]); // grade 3
                const media = Math.ceil((p1 + p2 + p3) / 3); // calculate the media of each students
                console.log(`Student's situation ${name}:`);
                console.log('Media of student is: ' + parseFloat(media));
                const { situation, naf } = calculateSituation(media, absence, totalclass); //take the situation and naf calculated in 
                                                                                          //function and take the information about the students
                data.push([situation, naf]);//taking the data in getting on the cell
                console.log(situation);
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