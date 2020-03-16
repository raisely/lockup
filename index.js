const pkg = require('./package');
const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const Conf = require('conf');
const { log, br, welcome } = require('./src/util/helpers');


const commands = require('./src/commands')();

welcome(pkg);

try {
	const config = new Conf({ cwd: process.cwd(), configName: 'lockup-config.json' });

	program
		.version(pkg.version)
		.option('-v, --debug', 'output debugging info')
		.option('-y, --yes', 'answer yes / default to all questions where possible (will fail on permission issues)');

	program
		.command('config')
		.description('Configre what apps and files to clean')
		.action(runCommand('interview', config));

	program
		.command('clean')
		.description('Clean your laptop of all sensitive files and save them to a file to uploaded to cloud storage')
		.action(runCommand('clean', config));

	program
		.command('restore')
		.description('Restore sensitive files to your laptop')
		.action(runCommand('restore', config));

	program.parse(process.argv);
} catch(error) {
	if (error.stderr) log(error.stderr);
	br();
	log(`Error: ${error}`);
	log(error.stack);
}

function runCommand(name, config) {
	return function runCommandWithArgs(...args) {
		return commands[name]({ ora, inquirer, config }, ...args);
	}
}
