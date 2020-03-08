const Action = require('../action');

class Development extends Action {
	selectFiles() {
		return {
			toSave: [
				':home/.ssh',
				':home/Sites/*/.env*',
				':home/Sites/*/.raisely.json',
				':home/Sites/*/.raisely.json',
				':home/Sites/raisely/relay/*.json',
				':home/Sites/*/raisely.json',
				':home/Sites/*/.raisely.json',
			]
		}
	}
}

module.exports = Development;
