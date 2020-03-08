const Action = require('../action');

class CloudDevelopment extends Action {
	selectFiles() {
		return {
			toSave: [
				// Amazon
				':home/.aws',
				// Google cloud credentials
				':home/.config',
			]
		}
	}
}

module.exports = CloudDevelopment;

