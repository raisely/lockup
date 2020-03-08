const allStorage = require('../stores')();
const allActions = require('../actions')();

const { log, modulesFromConfig } = require('../util/helpers');

async function interview({ ora, inquirer, config }) {
	const answer = await inquirer
		.prompt([
			{
				type: 'checkbox',
				name: 'actions',
				message: 'Which applications do you wish to sanitise?',
				choices: Object.keys(allActions).map(action => ({
					name: action,
					value: action,
				})),
				default: config.get('actions'),
			}, {
				type: 'list',
				name: 'storage',
				message: 'How do you want to store your data?',
				choices: Object.keys(allStorage).map(store => ({
					name: store,
					value: store,
				})),
			}
		]);

	config.set('actions', answer.actions);
	config.set('storage', [answer.storage]);

	// Init modules
	const { actions, storage } = modulesFromConfig(config);

	// Configure storage
	for (const store in storage) {
		await interviewClass({ ora, inquirer, config }, store, 'storage', storage[store]);
	};

	// Configure actions
	for (const action in actions) {
		await interviewClass({ ora, inquirer, config }, action, 'action', actions[action]);
	};

	log('Your configuration has been saved to');
	console.log(config.path);
}

async function interviewClass({ ora, inquirer, config }, name, configType, instance) {
	if (instance.interview) {
		const instanceConfig = await instance.interview({ ora, inquirer });
		config.set(`${configType}Config.${name}`, instanceConfig);
	}
}

module.exports = interview;