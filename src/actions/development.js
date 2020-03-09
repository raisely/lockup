const Action = require('../action');

class Development extends Action {
	selectFiles() {
		return {
			toSave: [
				':home/.ssh',
				':home/Sites/*/.env*',
				':home/Sites/*/*/.env*',
				':home/Sites/raisely/relay/*.json',
				':home/Sites/*/config.js',
			]
		}
	}
}

module.exports = Development;
