const del = require('del');
const fs = require('fs');
const { merge } = require('mochawesome-merge');

const reportTelegram = async (bot, chat_id, options) => {
    await buildReport(bot, chat_id, options?.reportsPath, options?.finalReport, options);
    await cleanOldReports(options?.reportsPath);
}

const buildReport = async (bot, chat_id, reports = 'reports/*.json', mergedReport = 'merged-report.json', options) => {
    await del(mergedReport, {force: true});
    const report = await merge({files: [reports], output: mergedReport});
    await fs.promises.writeFile(mergedReport, JSON.stringify(report, null, 4));
    const messages = await formatReport(mergedReport, options);
    for (const message of messages) {
        await bot.sendMessage(chat_id, message, {parse_mode: "HTML"});
    };
}


const cleanOldReports = async (reports = 'reports/*.json') => {
    const deletedFiles = await del(reports, {force: true});
    console.log(`Removed reports: ${deletedFiles.map(d => '\n' + d)}`);
}

const formatReport = async (reportFile = 'merged-report.json', options) => {
    let reportBuffer = await fs.promises.readFile(reportFile);
    const report = JSON.parse(reportBuffer);
    const reportMessages = [];
    if (options?.includeStats) {
        let statsMessage = `Statistic for the Test Run:\n`;
        statsMessage += `Number of suites executed: ${report.stats.suites}\n`;
        statsMessage += `Number of Test Cases: ${report.stats.tests}\n`;
        statsMessage += `Passed: ${report.stats.passes}\n`;
        statsMessage += `Failed: ${report.stats.failures}\n`;
        statsMessage += `Skipped: ${report.stats.pending}\n`;
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
                resultMessage += `${test.title} ${getTestState(test.state, options?.statuses)}\n`
            })
        })
        reportMessages.push(resultMessage);
    })
    return reportMessages;
}

const getTestState = (state, statuses) => {
    switch (state) {
        case 'passed':
            return statuses?.passed || '😋'
        case 'failed':
            return statuses?.failed ||'😡'
        case 'pending':
            return statuses?.pending ||'🥶'
    }
}

module.exports = reportTelegram;