const Storage = require('./storage');

class SaveFile extends Storage {
	async upload(filename) {
		// TODO check file exists
		this.filename = filename;
	}
	async download() {
		// TODO check file exists
	}
	afterCleanNotes() {
		return `
Your sensitive files have been saved in ${this.filename}

IMPORTANT: Upload this file to cloud storage, and then delete the file and any credentials for cloud storage from your computer`;
	}
}

module.exports = SaveFile;
