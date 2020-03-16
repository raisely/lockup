/**
 * Class to define an action for sanitising
 * an app or group of files
 *
 * interview
 * configure
 *
 * Clean
 * Notes before locking up
 * zip file
 * delete
 * upload file
 * Notes after lockup
 *
 * Restore
 * Pre restore
 * Download file
 * unzip
 * Post restore
 */
class Action {
	constructor() {

	}
	interview({ inquirer, ora }) {
		return {};
	}
	configure(config) {
		this.config = config;
	}
	/**
	 * Return a list of apps to stop before cleaning / restoring
	 * clean / restore will not proceed if app cannot be stopped
	 * To find out the name of the app you want to stop you can start the app and run
	 * `osascript -e 'tell application "System Events" to get name of (processes where background only is false)'`
	 *
	 * Each app will be stopped by executing `osascript -e 'quit app "<app>"'`
	 * @return {string[]}
	 */
	getApps() {
		return [];
	}

	/** Methods for cleaning */
	beforeClean() {

	}

	selectFiles() {
		return {};
	}
	afterClean() {

	}

	/** Methods for restoring */
	beforeRestore() {

	}
	afterRestore() {

	}
}

module.exports = Action;
