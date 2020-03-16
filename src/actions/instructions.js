const _ = require('lodash');
const Action = require('../action');

const methods = ['beforeClean', 'afterClean', 'beforeRestore', 'afterRestore'];

class Instructions extends Action {
	constructor() {
		super();
		methods
			.map(m => `${m}Notes`)
			.forEach(method => {
				this[method] = () => this.config[method];
			});
	}

	async interview(helpers) {
		const { inquirer } = helpers;
		const config = await inquirer
			.prompt(methods.map(name => ({
					type: 'editor',
					name: `${name}Notes`,
					message: `Instructions to display ${_.startCase(name).toLowerCase()}`,
				})));
		return config;
	}
}

module.exports = Instructions;

