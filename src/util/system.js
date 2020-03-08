const glob = require('glob');
const shelljs = require('shelljs');

async function exec(cmd, options = {}) {
	const { stdin, dontReject, silent } = options;
	return new Promise((resolve, reject) => {
		let child;
		child = shelljs.exec(cmd, { async: true, silent }, (code, stdout, stderr) => {
			if (!dontReject && (code !== 0)) {
				const error = new Error('Command failed');
				Object.assign(error, { code, stdout, stderr });
				return reject(error);
			}
			resolve({
				cmd, code, stdout, stderr
			});
		});

		if (stdin) {
			const lines = Array.isArray(stdin) ? stdin : [stdin];
			lines.forEach(p => child.stdin.write(`${p}\n`));
			child.stdin.end();
		}
	});
}

function resolvePaths(paths) {
	const resolvedPaths = paths.map(p => {
		const path = p.replace(/:home/, process.env.HOME);
		return glob.sync(path, { nonull: false });
	});
	return resolvedPaths;
}

module.exports = {
	exec,
	resolvePaths,
};
