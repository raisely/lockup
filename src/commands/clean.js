const { log, br, mapEachAction, modulesFromConfig } = require('../util/helpers');
const { stopApps } = require('../util/apps');
const { exec } = require('../util/system');
/**
 *
 * @param {*} actions
 */
async function clean({ ora, inquirer, config }) {
	const { actions, storage } = modulesFromConfig(config);

	const appsToStop = mapEachAction(actions, 'appsToStop').flat().filter(a => a);
	let beforeCleanNotes = `
The following apps will be stopped during cleaning ${appsToStop.join(', ')}`;

	mapEachAction(actions, 'beforeCleanNotes', (action, notes) => {
		beforeCleanNotes += `
${notes}
`;
	});
	log(`***************************
	About to clean
***************************`, 'green');
	log(beforeCleanNotes);

	inquirer.prompt({
		type: 'confirm',
		name: 'toBeDelivered',
		message: 'Is this for delivery?',
		default: false
	});

	// Ensure we can get credentials and can upload the file before we start cleaning
	await storage.beforeClean();

	await stopApps(appsToStop, { ora, inquirer });

	mapEachAction(actions, 'beforeClean').flat().filter(a => a);

	const masterList = { toDelete: [], toSave: [] }
	mapEachAction(actions, 'selectFiles').filter(a => a).forEach(files => {
		['toDelete', 'toSave'].forEach(type => {
			if (files[type]) masterList[type] = masterList[type].concat(files[type]);
		})
	});

	const file = await doClean(masterList, { ora, inquirer });
	await storage.upload(file);

	mapEachAction(actions, 'afterClean').flat().filter(a => a);
	let afterCleanNotes = '';
	mapEachAction(actions, 'afterCleanNotes', (action, notes) => {
		afterCleanNotes += `
${notes}
`;
	});
	log(afterCleanNotes);
	if (storage.afterCleanNotes) log(storage.afterCleanNotes());
}

async function doClean(fileList, { ora, inquirer }) {
	let spinner = ora(`Compressing files to preserve`);
	try {
		await exec('zip -rmT@ sensitive-files.zip', { stdin: fileList.toSave });
		spinner.success();

		spinner = ora(`Deleting cache files`);
		await exec('xargs rm -rf --', { stdin: fileList.toDelete.map(f => `"${f}"`) });
		spinner.success();
	} catch (e) {
		spinner.fail();
		throw e;
	}
}

module.exports = clean;
