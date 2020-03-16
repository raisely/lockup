const { log, br, mapEachAction, modulesFromConfig } = require('../util/helpers');
const { stopApps } = require('../util/apps');
const { exec, resolvePaths } = require('../util/system');
const flatten = require('lodash/flatten');

/**
 * Clean Command
 * @param {object} utils
 * @param {Ora} utils.ora
 * @param {Inquirer} utils.inquirer
 * @param {Conf} utils.config
 */
async function clean({ ora, inquirer, config }) {
	const { actions, storage } = modulesFromConfig(config);

	const appList = await mapEachAction(actions, 'appsToStop');
	const appsToStop = flatten(appList).filter(a => a);
	let beforeCleanNotes = '';

	if (appsToStop.length) beforeCleanNotes += `
The following apps will be stopped during cleaning ${appsToStop.join(', ')}`;

	await mapEachAction(actions, 'beforeCleanNotes', (action, notes) => {
		beforeCleanNotes += `
${notes}
`;
	});
	log(`***************************
	Preparing to clean
***************************`, 'green');
	log(beforeCleanNotes);

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

	// Ensure we can get credentials and can upload the file before we start cleaning
	await storage.beforeClean();

	await stopApps(appsToStop, { ora, inquirer });

	await mapEachAction(actions, 'beforeClean').filter(a => a);

	const masterList = { toDelete: [], toSave: [] }
	const selectedFiles = await mapEachAction(actions, 'selectFiles')
	flatten(selectedFiles).filter(a => a).forEach(files => {
		['toDelete', 'toSave'].forEach(type => {
			if (files[type]) masterList[type] = masterList[type].concat(files[type]);
		})
	});

	const file = await doClean(masterList, { ora, inquirer });
	await storage.upload(file);

	await mapEachAction(actions, 'afterClean').filter(a => a);
	let afterCleanNotes = '';
	await mapEachAction(actions, 'afterCleanNotes', (action, notes) => {
		afterCleanNotes += `
${notes}
`;
	});
	log(afterCleanNotes);
	if (storage.afterCleanNotes) log(storage.afterCleanNotes());
}

async function doClean(fileList, { ora, inquirer }) {
	const file = `./sensitive-files.zip`;
	let spinner = ora(`Compressing files to preserve`).start();
	const toSave = resolvePaths(fileList.toSave);
	const toDelete = resolvePaths(fileList.toDelete);
	// const toDelete = ['./file1.tmp', './file2.tmp'];
	try {
		const cmd = `zip -rmT@  ${file}`;
		console.log(fileList.toSave);
		// await exec(cmd, { stdin: toSave });
		await exec(cmd, { stdin: toSave });
		spinner.succeed();

		spinner = ora(`Deleting cache files`).start();

		await exec('xargs rm -rf ', { stdin: toDelete.map(f => `"${f}"`) });
		// await exec('xargs echo rm -rf ', {  });
		spinner.succeed();
	} catch (e) {
		spinner.fail();
		throw e;
	}
	return file;
}

module.exports = clean;
