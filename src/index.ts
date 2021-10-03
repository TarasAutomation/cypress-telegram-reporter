#!/usr/bin/env node

import {postReportTelegram} from "./reporter/post-report-telegram";
import {config} from "dotenv";
import TelegramBot = require("node-telegram-bot-api");

config();

const token = process.env.BOT_TOKEN || '';
const chatId = process.env.CHAT_ID || '';
const bot = new TelegramBot(token, {polling: true});

postReportTelegram(bot, chatId);