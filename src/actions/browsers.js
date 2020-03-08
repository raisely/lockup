const Action = require('../action');

class Browsers extends Action {
	beforeCleanNotes() {
		return [
			'Mac do not allow us to save cookies from Safari, before continuing you should open Safari and clear all cookies',
		];
	}
	appsToStop() {
		return ['Google Chrome', 'firefox', 'Safari'];
	}
	selectFiles() {
		return {
			toSave: [
				// Chrome
				':home/Library/Application Support/Google/Chrome/Default/Cookies',
				':home/Library/Application Support/Google/Chrome/Default/Local Storage',
				// Passwords
				':home/Library/Application Support/Google/Chrome/Default/Databases',

				// Firefox
				':home/Library/Application Support/Firefox/Profiles/*',

				// Safari
				// Cannot do safari as apple security locks the folders
			],
		}
	}
}

module.exports = Browsers;
