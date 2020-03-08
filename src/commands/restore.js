const { log, br, mapEachAction, modulesFromConfig } = require('../util/helpers');
const { stopApps } = require('../util/apps');
const { exec } = require('../util/system');
/**
 *
 * @param {*} actions
 */
async function restore({ ora, inquirer, config }) {
	const { actions, storage } = modulesFromConfig(config);

	const appsToStop = mapEachAction(actions, 'appsToStop').flat().filter(a => a);
	let beforeCleanNotes = `
The following apps will be stopped before restoring: ${appsToStop.join(', ')}`;

	mapEachAction(actions, 'beforeRestoreNotes', (action, notes) => {
		beforeCleanNotes += `
${notes}
`;
	});
	log(`***************************
	About to Restore
***************************`, 'green');
	log(beforeCleanNotes);

	inquirer.prompt({
		type: 'confirm',
		name: 'toBeDelivered',
		message: 'Is this for delivery?',
		default: false
	});

	// Ensure we can get credentials and can upload the file before we start cleaning
	await storage.beforeRestore();

	await stopApps(appsToStop, { ora, inquirer });

	mapEachAction(actions, 'beforeRestore').flat().filter(a => a);

	await storage.download(file);
	const file = await doRestore({ ora, inquirer });

	mapEachAction(actions, 'afterRestore').flat().filter(a => a);
	let afterCleanNotes = '';
	mapEachAction(actions, 'afterRestoreNotes', (action, notes) => {
		beforeCleanNotes += `
${notes}
`;
	});
	log(afterCleanNotes);
	if (storage.afterCleanNotes) log(storage.afterCleanNotes());
}

async function doRestore(fileList, { ora, inquirer }) {
	let spinner = ora(`Restoring files`);
	try {
		await exec('unzip -o sensitive-files -d /');
		spinner.success();
	} catch (e) {
		spinner.fail();
		throw e;
	}
}

module.exports = restore;
