import * as del from 'del';
import * as fs from 'fs';
const { merge } = require('mochawesome-merge');

export const postReportTelegram = (bot, chat_id: number|string, options?) => {
    if (options?.mergeReports || true)
        mergeReports();
    const messages = formatReport();
    messages.forEach(message => {
        bot.sendMessage(chat_id, message, {parse_mode: "HTML"});
    })
    if (options?.cleanOldReports)
        cleanOldReport();
}

const mergeReports = (reports = 'reports/*.json', mergedReport = 'merged-report.json') => {
    del.sync(mergedReport);
     merge({files: [reports], output: mergedReport}).then(report => {
         fs.writeFileSync(mergedReport, JSON.stringify(report, null, 4));
     });
}

const cleanOldReport = (reports = 'reports/*.json') => {
    const deletedFiles = del.sync(reports);
    console.log(`Removed reports: ${deletedFiles}`);
}

const formatReport = (reportFile = 'merged-report.json', options?) => {
    let reportBuffer = fs.readFileSync(reportFile);
    // @ts-ignore
    const report = JSON.parse(reportBuffer);
    const reportMessages: string[] = [];
    if (options?.includeStats){
        let statsMessage = `Statistic for the Test Run:\n`;
        statsMessage += `Number of suites executed: ${report.stats.suites}\n`;
        statsMessage += `Number of Test Cases: ${report.stats.tests}\n`;
        statsMessage += `Passed: ${report.stats.passes}\n`;
        statsMessage += `Failed: ${report.stats.failures}\n`;
        const testRunTime = new Date(report.stats.duration).toISOString().substr(11, 8);
        statsMessage += `Test run executed in ${testRunTime}\n`
        reportMessages.push(statsMessage);
    };
    const { results } = report;
    results.forEach(result => {
        const { file } = result;
        let resultMessage = `File Name: <i>${file}</i>\n`;
        const { suites } = result;
        suites.forEach(suite => {
            resultMessage += `<b>${suite.title}</b>\n`
            const { tests } = suite;
            tests.forEach(test => {
                resultMessage += `${test.title} ${getTestState(test.state)}\n`
            })
        })
        reportMessages.push(resultMessage);
    })
    return reportMessages;
}

const getTestState = (state: string) => {
    switch (state) {
        case 'passed':
            return '😋'
        case 'failed':
            return '😡'
        case 'pending':
            return '🥶'
    }
}