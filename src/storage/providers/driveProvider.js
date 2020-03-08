const { google } = require('googleapis');
const drive = google.drive('v3');

module.exports = {
	load() {
		return { google, drive };
	}
}
