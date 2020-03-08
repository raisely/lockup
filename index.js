const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const Conf = require('conf');
const { log, br } = require('./src/util/helpers');

const commands = require('./src/commands');

try {
	const config = new Conf();

	program
		.command('clean')
		.description('Clean your laptop of all sensitive files and save them to a file to uploaded to cloud storage')
		.action(runCommand('clean', config))

		.command('restore')
		.description('Restore sensitive files to your laptop')
		.action(runCommand('restore', config))

		.command('*')
		.description('Create a configuration for cleaning your laptop')
		.action(runCommand('interview', config));


	program.parse(process.argv);
} catch(error) {
	if (error.stderr) log(error.stderr);
	br();
	log(`Error: ${error.message}`);
}

function runCommand(name, config) {
	return function runCommandWithArgs(...args) {
		return commands[name]({ ora, inquirer, config }, ...args);
	}
}
