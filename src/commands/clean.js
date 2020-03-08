const { log, br, mapEachAction, modulesFromConfig } = require('../util/helpers');
const { stopApps } = require('../util/apps');
const { exec, resolvePaths } = require('../util/system');
const flatten = require('lodash/flatten');
/**
 *
 * @param {*} actions
 */
async function clean({ ora, inquirer, config }) {
	const { actions, storage } = modulesFromConfig(config);

	const appsToStop = flatten(mapEachAction(actions, 'appsToStop')).filter(a => a);
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

	mapEachAction(actions, 'beforeClean').filter(a => a);

	const masterList = { toDelete: [], toSave: [] }
	flatten(mapEachAction(actions, 'selectFiles')).filter(a => a).forEach(files => {
		['toDelete', 'toSave'].forEach(type => {
			if (files[type]) masterList[type] = masterList[type].concat(files[type]);
		})
	});

	const file = await doClean(masterList, { ora, inquirer });
	await storage.upload(file);

	mapEachAction(actions, 'afterClean').filter(a => a);
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
