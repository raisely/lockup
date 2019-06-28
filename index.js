const readline = require('readline');
const glob = require('glob');
const _ = require('lodash');
const { exec } = require('child_process');

const paths = [
    ':home/.ssh',
    ':home/.aws',
    // Google cloud credentials
    ':home/.config',
    ':home/Sites/*/.env*',
    ':home/Sites/*/raisely.json',
    ':home/Library/Keychains',
    ':home/Library/Containers/at.eggerapps.Postico',
];

// Caches that will be purged but NOT BACKED UP
const caches = [
    ':home/Library/Containers/*/Data/Library/Caches/*',
    ':home/Library/Caches/*',
];

const resolvedPaths = paths.map(p => {
    const path = p.replace(/:home/, process.env.HOME);
    return glob.sync(path, { nonull: false });
});

const allPaths = _.flatten(resolvedPaths);

const child = exec('zip -rmT@ sensitive-files.zip');

readline.createInterface({
    input: child.stdout,
}).on('line', console.log);
readline.createInterface({
    input: child.stderr,
}).on('line', console.log);

allPaths.forEach(p => child.stdin.write(`${p}\n`));
child.stdin.end();
