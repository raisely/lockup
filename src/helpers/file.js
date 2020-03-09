const shelljs = require('shelljs');
const startCase = require('lodash/startcase');

const { log } = require('../util/helpers');
const { exec } = require('../util/system');

/**
 * Check if a folder can be accessed and changed
 * Creates a temporary file in the folder and then deletes it
 * If the operation fails, will prompt the user to grant
 * Full Disk Access
 * @param {string} path
 */
async function testAndGuideRestrictedDir(action, path, { ora, inquirer }) {
	let spinner = ora('Checking access to path').start();
	try {
		shelljs.touch(`${path}/.lockupTestFile.tmp`);
		shelljs.rm(`${path}/.lockupTestFile.tmp`);
		spinner.succeed();
	} catch(e) {
		spinner.fail();
		log(`You need to grant lockup access to ${path} is required to secure ${startCase(action)}.`);
		log(`
To do this you need to
1. open System Preferences
2. Click on Security & Privacy
3. Click on the Privacy Tab
4. Click on Full Disk Access
5. Click the + button to add Terminal to the list of apps that are permitted
`);
		2.
		let answer = await inquirer.prompt({
			type: 'confirm',
			name: 'proceed',
			message: 'Do you want to set that up now?',
			default: false
		});
		if (!answer.proceed) {
			throw new Error('Aborted by user');
		}
		exec(`osascript -e 'launch app "System Preferences"'`);
		answer = await inquirer.prompt({
			type: 'confirm',
			name: 'proceed',
			message: 'Type Y when you are ready to proceeed',
			default: false
		});
		if (!answer.proceed) {
			throw new Error('Aborted by user');
		}
	}
}

module.exports = {
	testAndGuideRestrictedDir,
}
