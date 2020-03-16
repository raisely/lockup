const Action = require('../action');

class CloudDevelopment extends Action {
	selectFiles() {
		return {
			toSave: [
				// Amazon
				':home/.aws',
				// Google & Stripe cloud credentials
				':home/.config',
			],
			toDelete: [
				// Delete log files
				':home/.config/gcloud/logs',
			],
		}
	}
}

module.exports = CloudDevelopment;

