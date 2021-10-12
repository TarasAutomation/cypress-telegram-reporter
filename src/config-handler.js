const reportTelegram = require("./reporter/report-telegram");

require('dotenv').config()
const TelegramBot = require("node-telegram-bot-api");

const handleConfig = (on, config) => {
    const { telegram } = config.env;
    const token = process.env.BOT_TOKEN || telegram.botToken;
    const chatId = process.env.CHAT_ID || telegram.chatId;
    const options = {
        includeStats: telegram?.includeStats,
        statuses: telegram?.statuses,
        reportsPath: telegram?.reportsPath,
        finalReport: telegram?.finalReport
    }
    if (token && chatId) {
        const bot = new TelegramBot(token, {polling: true});
        on('after:run', async () => {
            await reportTelegram(bot, chatId, options);
        })
    } else {
        console.error('Telegram reporter configuration failed.');
    }
}

module.exports = handleConfig;