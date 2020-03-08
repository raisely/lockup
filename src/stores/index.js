const fs = require('fs');
const path = require('path');

let stores;

function init() {
	if (!stores) {
		stores = {};

		// Load each model file
		fs.readdirSync(__dirname)
			.filter(
				file =>
					file.indexOf('.') !== 0 &&
					file !== 'index.js' &&
					file.endsWith('.js')
			)
			.forEach(file => {
				const store = require(path.join(__dirname, file));

				// Ignore actions under development
				if (store) stores[store.name] = store;
			});
	}

	return stores;
}

module.exports = init;
