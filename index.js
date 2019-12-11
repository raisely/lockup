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
    ':home/Library/Containers/at.eggerapps.Postico/Data/Library/Preferences/',
    ':home/Library/Containers/at.eggerapps.Postico/Data/Library/Application Support/Postico/',
    ':home/Library/Application Support/Authy Desktop/',
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

const command = process.env.EXTRACT ? 
    'unzip -o sensitive-files -d /' : 
    'zip -rmT@ sensitive-files.zip';

const child = exec(command);

readline.createInterface({
    input: child.stdout,
}).on('line', console.log);
readline.createInterface({
    input: child.stderr,
}).on('line', console.log);

allPaths.forEach(p => child.stdin.write(`${p}\n`));
child.stdin.end();
