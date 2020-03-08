const fs = require('fs');
const path = require('path');

let actions;

function init() {
	if (!actions) {
		actions = {};

		// Load each model file
		fs.readdirSync(__dirname)
			.filter(
				file =>
					file.indexOf('.') !== 0 &&
					file !== 'index.js' &&
					file.endsWith('.js')
			)
			.forEach(file => {
				const action = require(path.join(__dirname, file));

				actions[action.name] = action;
			});
	}

	return actions;
}

module.exports = init;
