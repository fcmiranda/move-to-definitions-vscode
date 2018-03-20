'use strict';
const vscode = require('vscode'),
setup = require('./setup'),
spawn = require('child_process').spawn;

function filterMatch(match) {
    return match !== null && match.text.trim().length < 350;
}

function fixColumn(match) {
    if (match.column === 1 && /^\s/.test(match.text) === false) { // ripgrep's bug
        match.column = 0;
    }

    let emptyChars = '';

    const matches = /^[\s.]/.exec(match.text.substring(match.column));
    if (matches) emptyChars = matches[0];

    return {
        text: match.text,
        path: match.path,
        fileName: match.fileName,
        line: match.line,
        column: match.column + emptyChars.length,
    };
}

function ripgrep(fileTypes, regex) {    
    var scanPaths = [vscode.workspace.workspaceFolders[0].uri.fsPath];
    const args = fileTypes.map(x => `--glob=${x}`);
    var arrLines = [];

    return new Promise((resolve) => {   
        args.push(...[
            '--line-number', '--column', '--no-ignore-vcs', '--ignore-case', regex,
        ]);
        args.push(...scanPaths);

        var runRipGrep = spawn('C:\\desenv\\ripgrep\\rg.exe', args);
        runRipGrep.stdout.setEncoding("UTF-8");
        runRipGrep.stdout.on('data', data => {
            var lines = data.split('\n').map(result => {
                if (result.trim().length) {
                    const data = result.split(':');
                    // Windows filepath will become ['C','Windows/blah'], so this fixes it.
                    if (data[0].length === 1) {
                        const driveLetter = data.shift();
                        const path = data.shift();
                        data.unshift(`${driveLetter}:${path}`);
                    }
                    return {
                        text: result.substring([data[0], data[1], data[2]].join(':').length + 1),
                        path: data[0],
                        fileName: '',
                        line: Number(data[1] - 1),
                        column: Number(data[2] - 1),
                    };
                }
                return null;
            }).filter(filterMatch).map(fixColumn);
            arrLines = arrLines.concat(lines);
        });

        runRipGrep.on('close', code => {
            if (code == 0) {
                resolve(arrLines);
            }
        });
    });
}

function find(extensionToScanRegex, word) {    
    return new Promise((resolve) => {        
        var stp = setup.scanRegex(extensionToScanRegex, word);
        ripgrep(stp.fileTypes, stp.regex).then(locations => {
            resolve({                
                locations: locations
            });
        });
    });
}
exports.find = find;