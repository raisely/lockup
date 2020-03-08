const Action = require('../action');

class Instructions extends Action {
	constructor() {
		super();
		const methods = ['beforeClean', 'afterClean', 'beforeRestore', 'afterRestore'];
		methods
			.map(m => `${m}Notes`)
			.forEach(method => {
				this.method = () => this.config[method];
			});
	}
}

module.exports = Instructions;

