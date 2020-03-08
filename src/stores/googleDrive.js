const Storage = require('../storage');
const DriveProvider = require('./providers/driveProvider');

class GoogleDrive extends Storage {
	async beforeClean() {

	}
	async upload(filename) {
		// const [jwt, team] = await Promise.all([
		// 	authorize(),

		const metadata = {
			name,
			parents: [folder],
		};

		// Pipe the file directly through to google
		const buffer = new PassThrough()
		request(url).pipe(buffer);

		const media = {
			// mimeType: 'text/plain',
			body: buffer,
		};

		const res = await uploadFile(jwt, metadata, media);

	}
	async download() {

	}
}

/**
 * Upload a file to google drive
 * @param {*} jwtClient obtained from authorize()
 * @param {object} metadata filename and folder (as per file.create api)
 * @param {object} media optional mimetype and readable stream
 */
async function uploadFile(jwtClient, metadata, media) {
	const { drive } = DriveProvider.load();
	const newFile = await drive.files.create({
		auth: jwtClient,
		resource: metadata,
		media,
		fields: 'id, name',
	});
	return newFile;
}

module.exports = GoogleDrive;
