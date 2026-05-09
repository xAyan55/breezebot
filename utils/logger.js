const chalk = require('chalk');
const moment = require('moment');

function timestamp() {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;
}

module.exports = {
  info: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.blue('[INFO]')} ${content}`);
  },
  success: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.green('[SUCCESS]')} ${content}`);
  },
  warn: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.yellow('[WARN]')} ${content}`);
  },
  error: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.red('[ERROR]')} ${content}`);
  },
  database: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.magenta('[DATABASE]')} ${content}`);
  },
  cmd: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.white('[COMMAND]')} ${content}`);
  },
  event: (content) => {
    console.log(`${chalk.cyan(timestamp())} ${chalk.gray('[EVENT]')} ${content}`);
  },
  premiumBrand: () => {
    console.log(chalk.blue.bold(`
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ____                               ____        _            
 |  _ \\                             |  _ \\      | |           
 | |_) |_ __ ___  ___ _______       | |_) |_   _| |_ ___  ___ 
 |  _ <| '__/ _ \\/ _ \\_  / _ \\      |  _ <| | | | __/ _ \\/ __|
 | |_) | | |  __/  __// /  __/      | |_) | |_| | ||  __/\\__ \\
 |____/|_|  \\___|\\___/___\\___|      |____/ \\__, |\\__\\___||___/
                                            __/ |             
                                           |___/              
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💎 Powered by BreezeBytes
  🚀 Premium Discord Solutions
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `));
  }
};
