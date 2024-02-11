# Automatic Update of Student Grades in Google Sheets
This is a Node.js script that automates the calculation of student grades based on the grades and absences recorded in a Google Sheets spreadsheet. 
The script also automatically updates the spreadsheet with student statuses such as "Aprovado", "Reprovado por Falta", "Exame Final", or "Reprovado por Nota".

## Challenge 

**The application must be able:**

:white_check_mark:To read a Google Sheets spreadsheet,

:white_check_mark:Search for possible information, 

:white_check_mark:Calculate and write the result in the spreadsheet.

## Requirements
- Node.js installed on your machine.
- Google Sheets API credentials.

## Setup
1. Clone this repository to your local environment.

2. Install Node.js dependencies using the following command:

```
npm install
```
3. Get your Google Sheets API credentials:

- Go to the [Google Cloud Console page](https://console.cloud.google.com/).
- Create a new project or select an existing one.
- Enable the Google Sheets API for your project.
- Create a service credential with access to the Google Sheets API.
Download the JSON credentials file and save it in the project directory as ***credentials.json.***

4. Open the ***index.js*** file and update the spreadsheet ID and cell range as needed:

```
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
const range = 'SHEET_NAME!A4:H'; // Range of cells to be read and updated
```
5. Run the script using the following command:

```
node index.js
```

This will read the data from the specified spreadsheet, calculate the students' grades, and automatically update the students' statuses in the spreadsheet.

# Customization
You can customize the grade calculation rules and student statuses by modifying the ***calculateSituation()*** function in the ***index.js*** file. This function contains the logic to determine whether a student has passed, failed due to absence, needs a final exam, etc.

## Author
Erica Lima e Silva

## Link Google Sheet
[Google sheets Erica Lima e Silva](https://docs.google.com/spreadsheets/d/1npbD3YOJQpfNSCnI0Jrj-rZk1VMBwtcPIQh_bg68fTM/edit?usp=sharing)
