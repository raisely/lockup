const Action = require('../action');

class Authy extends Action {
	appsToStop() {
		return ['Authy Desktop'];
	}
	selectFiles() {
		return {
			toSave: [
				':home/Library/Application Support/Authy Desktop/',
			]
		}
	}
}

module.exports = Authy;
