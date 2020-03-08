const Action = require('../action');

class Slack extends Action {
	appsToStop() {
		return ['Slack'];
	}
	selectFiles() {
		const base = ':home/Library/Application Support/Slack/'
		return {
			toSave: [
				'databases',
				'Cookies',
				'Cookies-journal',
				'IndexedDB',
				'Local Storage',
				'Preferences',
				'SingletonCookie',
				'Service Worker/Database',
				'storage',
				'shared_proto_db',
			].map(p => `${base}${p}`),
			toDelete: [
				'Cache',
				'Code Cache',
				'GPU Cache',
				'Service Worker/CacheStorage',
				'Service Worker/ScriptCache',
			].map(p => `${base}${p}`)
		}
	}
}

module.exports = Slack;
