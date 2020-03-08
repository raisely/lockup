const chalk = require('chalk');
const get = require('lodash/get');

const stores = require('../storage')();
const actions = require('../actions')();

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

function mapEachAction(allActions, name, fn) {
	return allActions.map(action => {
		const result = action[name] && action[name]();
		if (result) {
			return fn ? fn(action, result) : result;
		}

		return null;
	});
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
		const initialisedStorage = new actions[store]();
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
	log,
	br,
	error,
	mapEachAction,
};
