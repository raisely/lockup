const { exec } = require('./system');

async function stopApps(appsToStop, { ora, inquirer }) {
	let spinner = ora(`Stopping applications`).start();

	const appExecutions = await Promise.all(appsToStop.map(app => {
		return exec(`osascript -e 'quit app "${app}"'`, { dontReject: true })
			.then(({ code }) => ({
				app,
				code,
			}));
	}));
	const failedApps = appExecutions.filter(result => result.code !== 0)
	.map(result => result.app)
	.join(',');

	if (failedApps) {
		spinner.fail();
		throw new Error(`The following apps did not shutdown: ${failedApps}`);
	}

	spinner.succeed();
}

module.exports = {
	stopApps,
}
