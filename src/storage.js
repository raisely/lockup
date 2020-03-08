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
class Storage {
	constructor() {

	}
	interview({ inquirer, ora }) {

	}
	configure(config) {
		this.conig = config;
	}

	/** Methods for cleaning */
	beforeClean() {

	}

	upload() {

	}
	download() {

	}

	afterClean() {

	}

	/** Methods for restoring */
	beforeRestore() {

	}
	afterRestore() {

	}
}

module.exports = Storage;
