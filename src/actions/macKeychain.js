const Action = require('../action');
const { resolvePaths } = require('../util/system');
const { testAndGuideRestrictedDir } = require('../helpers/file');

class Keychain extends Action {
	beforeClean(helpers) {
		const path = resolvePaths([':home/Library/Keychains']);
		testAndGuideRestrictedDir(path[0], helpers);
	}
	selectFiles() {
		return {
			toSave: [
				':home/Library/Keychains',
			]
		}
	}
}

module.exports = Keychain;
