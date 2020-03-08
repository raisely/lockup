const { exec } = require('./system');

async function stopApps(appsToStop, { ora, inquirer }) {
	let spinner = ora(`Stopping applications`);

	const failedApps = await appsToStop.map(app => {
		exec(`osascript -e 'quit app "${app}"'`)
			.then(({ code }) => ({
				app,
				code,
			}));
	})
	.filter(result => result.code !== 0)
	.map(result => result.app)
	.join(',');

	if (failedApps) {
		spinner.fail();
		throw new Error(`The following apps did not shutdown: ${failedApps}`);
	}

	spinner.success();
}

module.exports = {
	stopApps,
}
