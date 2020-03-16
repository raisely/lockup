const Action = require('../action');
const { resolvePaths } = require('../util/system');
const { testAndGuideRestrictedDir } = require('../helpers/file');

class Keychain extends Action {
	beforeClean(helpers) {
		const paths = resolvePaths([':home/Library/Calendar', ':home/Library/Application Support/AddressBook/']);
		testAndGuideRestrictedDir(paths[0], helpers);
		testAndGuideRestrictedDir(paths[1], helpers);
	}
	selectFiles() {
		return {
			toSave: [
				':home/Library/Application Support/AddressBook/*.aclcddb*',
				':home/Library/Application Support/AddressBook/*.abcddb*',
				':home/Library/Application Support/AddressBook/Sources/*/*.abcddb*',

				':home/Library/Calendar/*.caldav',
				':home/Library/Calendar/*.calendar',
				':home/Library/Calendar/*.plist',
			]
		}
	}
}

module.exports = Keychain;
