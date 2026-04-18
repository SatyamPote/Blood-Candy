import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';
import ora from 'ora';
import cliCursor from 'cli-cursor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cliCursor.hide();

const ASCII_LOGO = `
 ${chalk.red('██████╗ ██╗      ██████╗  ██████╗ ██████╗')} 
 ${chalk.red('██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗')}
 ${chalk.red('██████╔╝██║     ██║   ██║██║   ██║██║  ██║')}
 ${chalk.red('██╔══██╗██║     ██║   ██║██║   ██║██║  ██║')}
 ${chalk.red('██████╔╝███████╗╚██████╔╝╚██████╔╝██████╔╝')}
 ${chalk.red('╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝')} 
  ${chalk.red.bold('██████╗ █████╗ ███╗   ██╗██████╗ ██╗   ██╗')}
 ${chalk.red.bold('██╔════╝██╔══██╗████╗  ██║██╔══██╗╚██╗ ██╔╝')}
 ${chalk.red.bold('██║     ███████║██╔██╗ ██║██║  ██║ ╚████╔╝')} 
 ${chalk.red.bold('██║     ██╔══██║██║╚██╗██║██║  ██║  ╚██╔╝')}  
 ${chalk.red.bold('╚██████╗██║  ██║██║ ╚████║██████╔╝   ██║')}   
  ${chalk.red.bold('╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝    ╚═╝')}   🍬
`;

function renderDashboard() {
    console.clear();
    console.log(ASCII_LOGO);
    
    const welcome = boxen(
        `${chalk.white.bold('BLOOD CANDY | COMMAND CENTER')}\n\n` +
        `${chalk.gray('Identity:')}  ${chalk.white('SatyamPote')}\n` +
        `${chalk.gray('Memory:')}    ${chalk.blue('https://graphify.net/')}\n` +
        `${chalk.gray('Access:')}    ${chalk.red.bold('DANGER-FULL-ACCESS (TOTAL)')}\n` +
        `${chalk.gray('Status:')}    ${chalk.green('ELITE')}`,
        {
            padding: 1,
            margin: { top: 1, bottom: 1, left: 1, right: 1 },
            borderStyle: 'double',
            borderColor: 'red',
            title: ' [ 🍭 Node 01 ] ',
            titleAlignment: 'center'
        }
    );

    console.log(welcome);
    console.log(chalk.gray(`  PWD: ${process.cwd()}`));
    console.log(chalk.red(`  ────────────────────────────────────────────────────────────`));
}

function purgeSessions() {
    try {
        const sessionPath = path.join(process.env.USERPROFILE || process.env.HOME, '.bloodcandy', 'sessions');
        if (fs.existsSync(sessionPath)) {
            const files = fs.readdirSync(sessionPath);
            for (const file of files) {
                fs.unlinkSync(path.join(sessionPath, file));
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

async function start() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        renderDashboard();
        console.log(chalk.yellow('\n  [!] Ignition: API KEY REQUIRED.\n'));
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'apiKey',
                message: 'Enter your Groq API Key:',
                validate: (val) => val.length > 20 || 'Invalid API Key'
            }
        ]);
        const envContent = `OPENAI_API_KEY=${answers.apiKey}\nOPENAI_BASE_URL=https://api.groq.com/openai/v1\nGROQ_API_KEY=${answers.apiKey}\nGROQ_BASE_URL=https://api.groq.com/openai/v1\n`;
        fs.writeFileSync(envPath, envContent);
        console.log(chalk.green('\n  [✓] Vault Locked. Ignition sequence ready.\n'));
    }

    while (true) {
        renderDashboard();
        const { command } = await inquirer.prompt([
            {
                type: 'input',
                name: 'command',
                message: chalk.red.bold('BLOOD-CANDY $'),
                prefix: ''
            }
        ]);

        let cmd = command.trim().toLowerCase();
        if (cmd.startsWith('/')) cmd = cmd.substring(1);

        if (cmd === 'exit' || cmd === 'quit') {
            cliCursor.show();
            process.exit(0);
        }

        console.log(chalk.gray(`\n  Executing sequence: ${cmd}...`));
        
        switch (cmd) {
            case 'help':
            case '?':
                console.log(chalk.white(`\n  ${chalk.bold('COMMAND MODULES:')}\n` +
                    `  /run     - Ignites AI in UNRESTRICTED mode (Auto-Purge)\n` +
                    `  /fresh   - Nuclear purge of all history\n` +
                    `  /status  - Scans system health\n` +
                    `  /export  - Extracts context snapshot\n` +
                    `  /setkey  - Updates the API vault\n` +
                    `  /exit    - Shuts down the node`));
                break;

            case 'fresh':
                const freshSpinner = ora('Nuclear purging sessions...').start();
                if (purgeSessions()) {
                    freshSpinner.succeed(chalk.green('Archive cleared. Zero baggage.'));
                } else {
                    freshSpinner.fail(chalk.red('Purge failed or Path missing.'));
                }
                break;

            case 'run':
                console.log(chalk.red('\n  Purging old data & Igniting UNRESTRICTED Engine...'));
                purgeSessions();
                try {
                    // Added --permission-mode unrestricted for full PC access
                    execSync('.\\rust\\target\\debug\\bloodcandy.exe --model groq/llama-3.1-8b-instant --permission-mode danger-full-access', { stdio: 'inherit' });
                } catch (e) {}
                break;

            case 'export':
                const snapshotPath = path.join(__dirname, 'BLOOD_CANDY_SNAPSHOT.md');
                const snapshotContent = `# 🍭 BLOOD CANDY CONTEXT SNAPSHOT\n- Role: Senior Software Engineer\n- Access: Full System (Unrestricted)\n- Memory Node: https://graphify.net/\n`;
                fs.writeFileSync(snapshotPath, snapshotContent);
                console.log(chalk.green(`\n  [✓] Snapshot preserved: ${snapshotPath}`));
                break;

            case 'setkey':
                const answers = await inquirer.prompt([{ type: 'input', name: 'key', message: 'New API Key:' }]);
                fs.writeFileSync(envPath, `OPENAI_API_KEY=${answers.key}\nOPENAI_BASE_URL=https://api.groq.com/openai/v1\nGROQ_API_KEY=${answers.key}\nGROQ_BASE_URL=https://api.groq.com/openai/v1\n`);
                console.log(chalk.green('  Key updated.'));
                break;

            default:
                console.log(chalk.red(`\n  [!] Command unrecognized. Type /help.`));
        }

        await new Promise(r => setTimeout(r, 2000));
    }
}

start().catch(err => {
    cliCursor.show();
    console.error(err);
});
