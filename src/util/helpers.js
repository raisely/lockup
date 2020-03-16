const chalk = require('chalk');
const get = require('lodash/get');

const stores = require('../stores')();
const actions = require('../actions')();

function welcome({ version }) {
	log(`
******************************
	Lockup (${version})
******************************
`, 'magenta')
}

function log(message, color) {
	console.log(chalk[color || 'white'](message))
}

function br() {
	return console.log('');
}

function error(e, loader) {
	const message = get(e, 'response.body.errors[0].message') || e.message || e;
	if (loader) {
		loader.fail(message);
	} else {
		console.log(`${chalk.bgRed('Error:')} ${chalk.red(message)}`);
	}
}

async function mapEachAction(allActions, name, fn) {
	const results = [];
	for (const index in allActions) {
		const action = allActions[index];
		const result = action[name] && await action[name]();
		let finalResult = result;
		if (result) {
			finalResult = fn ? fn(action, result) : result;
		} else {
			finalResult = null;
		}

		result.push(finalResult)
	}
	return results;
}

function modulesFromConfig(config) {
	const selectedActions = config.get('actions', []);
	const selectedStorage = config.get('storage', []);

	const actionConfigs = config.get('actionConfig', {});
	const storageConfigs = config.get('storageConfig', {});

	const initialisedActions = selectedActions.map(action => {
		if (!actions[action]) throw new Error(`Unknown action: ${action}`);
		const initialisedAction = new actions[action]();
		initialisedAction.configure(get(actionConfigs, action, {}));
		return initialisedAction;
	});

	const initialisedStores = selectedStorage.map(store => {
		if (!stores[store]) throw new Error(`Unknown storage: ${store}`);

		const initialisedStorage = new stores[store]();
		initialisedStorage.configure(get(storageConfigs, store, {}));
		return initialisedStorage;
	});

	return {
		actions: initialisedActions,
		storage: initialisedStores[0],
	}
}

module.exports = {
	modulesFromConfig,
	welcome,
	log,
	br,
	error,
	mapEachAction,
};
