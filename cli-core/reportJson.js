const fs = require('fs');
const path = require('path');
const utils = require('./utils');

//create xlsx report for all the analysed pages and recap on the first sheet
async function create_JSON_report(reportObject, options) {
    const OUTPUT_FILE = path.resolve(options.report_output_file);
    const fileList = reportObject.reports;
    const globalReport = reportObject.globalReport;
    const finalReport = {};

    //initialise progress bar
    const progressBar = utils.createProgressBar(
        options,
        fileList.length + 2,
        'Create JSON report',
        'Creating JSON report ...'
    );

    //Creating the recap section
    const globalReport_data = JSON.parse(fs.readFileSync(globalReport.path).toString());
    finalReport.globalReport = globalReport_data;
    if (progressBar) progressBar.tick();

    //Creating one report sheet per file
    let count = 1;
    fileList.forEach((file) => {
        let obj = JSON.parse(fs.readFileSync(file.path).toString());
        if (obj.pages) {
            obj.pages.forEach((page) => {
                finalReport[page.url] = obj;
            });
        }
        if (progressBar) progressBar.tick();
        count ++;
    });
    //save report
    try {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalReport));
    } catch (error) {
        throw ` report_output_file : Path "${OUTPUT_FILE}" cannot be reached.`;
    }
}


module.exports = {
    create_JSON_report,
};
