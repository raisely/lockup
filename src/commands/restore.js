const { log, br, mapEachAction, modulesFromConfig } = require('../util/helpers');
const { stopApps } = require('../util/apps');
const { exec } = require('../util/system');
const flatten = require('lodash/flatten');
/**
 *
 * @param {*} actions
 */
async function restore({ ora, inquirer, config }) {
	const { actions, storage } = modulesFromConfig(config);

	const appList = await mapEachAction(actions, 'appsToStop');
	const appsToStop = flatten(appList).filter(a => a);
	let beforeRestoreNotes = `
The following apps will be stopped before restoring: ${appsToStop.join(', ')}`;

	await mapEachAction(actions, 'beforeRestoreNotes', (action, notes) => {
		beforeRestoreNotes += `
${notes}
`;
	});
	log(`***************************
	About to Restore
***************************`, 'green');
	log(beforeRestoreNotes);

	const answer = await inquirer.prompt({
		type: 'confirm',
		name: 'proceed',
		message: 'Are you ready to proceed?',
		default: false
	});

	if (!answer.proceed) {
		log('Aborted');
		return;
	}

	await storage.beforeRestore();

	await stopApps(appsToStop, { ora, inquirer });

	await mapEachAction(actions, 'beforeRestore');

	// const filename = await storage.download();
	const filename = './sensitive-files.zip';
	await doRestore(filename, { ora, inquirer });

	await mapEachAction(actions, 'afterRestore');
	let afterRestoreNotes = '';
	await mapEachAction(actions, 'afterRestoreNotes', (action, notes) => {
		afterRestoreNotes += `
${notes}
`;
	});
	log(afterRestoreNotes);
	if (storage.afterRestoreNotes) log(storage.afterRestoreNotes());
}

async function doRestore(filename, { ora, inquirer }) {
	let spinner = ora(`Restoring files`).start();
	try {
		await exec(`unzip -o ${filename} -d /`);
		spinner.succeed();
	} catch (e) {
		spinner.fail();
		throw e;
	}
}

module.exports = restore;
