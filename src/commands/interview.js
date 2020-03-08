const allStorage = require('../storage')();
const allActions = require('../actions')();

const { modulesFromConfig } = require('../helpers');

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
	Object.keys(storage).forEach(store => {
		interviewClass(config, store, 'storage', storage[store]);
	});

	// Configure actions
	Object.keys(actions).forEach(action => {
		interviewClass(config, action, 'action', actions[action]);
	});
}

function interviewClass(config, name, configType, instance) {
	if (instance.interview) {
		const instanceConfig = instance.interview();
		config.set(`${configType}Config.${name}`, instanceConfig);
	}
}

module.exports = interview;
