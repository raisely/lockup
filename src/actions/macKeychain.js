const Action = require('../action');

class Keychain extends Action {
	selectFiles() {
		return {
			toSave: [
				':home/Library/Keychains',
			]
		}
	}
}

module.exports = Keychain;
