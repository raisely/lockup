const Action = require('../action');

class RaiselyCli extends Action {
	selectFiles() {
		return {
			toSave: [
				':home/Sites/*/raisely.json',
				':home/Sites/*/.raisely.json',
			]
		}
	}
}

module.exports = RaiselyCli;


