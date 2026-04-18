const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const boxen = require('boxen');

async function setKey() {
    console.clear();
    console.log(boxen(chalk.red.bold('🍭 BLOOD CANDY | KEY MANAGER'), { padding: 1, borderColor: 'red', borderStyle: 'double' }));
    
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'apiKey',
            message: 'Enter your new Groq API Key:',
            validate: (val) => val.length > 20 || 'Invalid API Key'
        }
    ]);

    const envPath = path.join(__dirname, '../.env');
    const content = `OPENAI_API_KEY=${answers.apiKey}\nOPENAI_BASE_URL=https://api.groq.com/openai/v1\nGROQ_API_KEY=${answers.apiKey}\nGROQ_BASE_URL=https://api.groq.com/openai/v1\n`;

    fs.writeFileSync(envPath, content);
    console.log(chalk.green('\n  [✓] Key stored successfully in terminal vault.\n'));
}

setKey();
