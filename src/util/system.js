const glob = require('glob');
const shelljs = require('shelljs');

async function exec(cmd, { stdin }) {
	return new Promise((resolve, reject) => {
		let child;
		child = shelljs.exec(cmd, { async: true }, (code, stdout, stderr) => {
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
