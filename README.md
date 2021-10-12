
# Cypress Telegram Reporter
### Post your test results right into the Telegram channel
Report will be posted by your own Telegram Bot, so you can name it whatever you want and also add to multiple channels if necessary.


## Installation

Install the package 

```sh
npm i cypress-telegram-reporter
```

Create .env file in your project directory if you don't have one.

##### Now we need a Telegram Bot and Channel.
1. Create a channel that you're going to use for posting a report.
2. Search for @BotFather user in Telegram.
3. Follow instructions and create a Bot. Name it so you know it's responsible for posting reports. (CompanyNameReportBot)
4. Save API key for your bot securely.
5. Put the API key into the .env variable - BOT_TOKEN
6. Open your channel and copy invite link
7. Send this link to any bot that can give you the chat ID (e.g. @username_to_id_bot)
8. Store this chat ID in the .env variable - CHAT_ID

Our reporting channel is now all setup.

##### Also we need to add the reporter configuration for Cypress.
Create report config file in your project directory:
```json
{
  "reporterEnabled": "mochawesome",
  "mochawesomeReporterOptions": {
    "reportDir": "./mocha-reports",
    "quiet": true,
    "overwrite": false,
    "html": false,
    "json": true
  }
}
```
Now edit the cypress configuration file (cypress.json) and add this lines.
```json
{
    "reporter": "cypress-multi-reporters",
    "reporterOptions": {
        "configFile": "reporter-config.json"
    }
}
```

Install reporter pre-requisites:
```sh
    npm install cypress-multi-reporters --save-dev
    npm install mochawesome --save-dev
    npm install mochawesome-merge --save-dev
    npm install mochawesome-report-generator --save-dev
```

##### Finally let's install the plugin 
Add this line to your plugins file:
```js
const telegramReport = require('cypress-telegram-reporter');
```
And apply the report to the current config:
```js
module.exports = (on, config) => {
  telegramReporter(on, config);
}
```

## Usage
Now simply run your tests from the command line:
```sh
npx cypress run
```

#### Options
In order to customize your report you'll need to edit the cypress config file.\
All the configuration should be added to `telegram` object in the `env` property.\
`includeStats`: If set to `true` your report will also contain statistics of each test run.\
`reportsPath`: Pattern for all your stored mochawesome reports. (default - reports/*.json)\
`finalReport`: Name of the file where combined report is stored. (default - merged-report.json)\
`statuses`: Object for modifying the result statuses text/symbols. \
       `passed`: Status for Passed tests. (default - 😋)\
       `failed`: Status for Failed tests. (default - 😡)\
       `pending`: Status for Pending/Skipped tests. (default - 🥶)

#### Examples
Cypress configuration file: (cypress.json)
```json
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  },
  "env": {
    "telegram": {
      "includeStats": true,
      "reportsPath": "./mocha-reports/*.json",
      "finalReport": "final-report.json",
      "statuses": {
        "passed": "PASSED",
        "failed": "FAILED",
        "pending": "SKIPPED"
      }
    }
  }
}
```

## License

MIT

**Let me know in case of any issues!**