const Action = require('../action');

class Postico extends Action {
	appsToStop() {
		return ['Postico'];
	}
	selectFiles() {
		return {
			toSave: [
				':home/Library/Containers/at.eggerapps.Postico/Data/Library/Preferences/',
				':home/Library/Containers/at.eggerapps.Postico/Data/Library/Application Support/Postico/'
			]
		}
	}
}

module.exports = Postico;

