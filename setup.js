"use strict"
const config = require('./config');

function scanRegex(fileExtension, word) {

    fileExtension = "*"+fileExtension;

    const scanGrammars = [];
    let scanRegexes = [];
    let scanFiles = [];
    let wordRegexes = [];
    const grammarNames = Object.keys(config);
    for (let i = 0; i < grammarNames.length; i++) {
        const grammarName = grammarNames[i];
        const grammarOption = config[grammarName];
        if (grammarOption.files.includes(fileExtension)) {
            if (grammarOption.dependencies) {
                grammarOption.dependencies.map(x => scanGrammars.push(x));
            }

            scanGrammars.push(grammarName);
        }
    }
    for (let i = 0; i < scanGrammars.length; i++) {
        const grammarName = scanGrammars[i];
        const grammarOption = config[grammarName];

        scanRegexes.push(...grammarOption.regexes.map(x => x.source));
        scanFiles.push(...grammarOption.files);
        wordRegexes.push(grammarOption.word.source);
    }

    if (scanRegexes.length === 0) {
        return {
            message: 'This language is not supported . Pull Request Welcome 👏.',
        };
    }
    
    if (!word.trim().length) {
        return {
            message: 'Unknown keyword .',
        };
    }

    scanRegexes = scanRegexes.filter((e, i, a) => a.lastIndexOf(e) === i);
    scanFiles = scanFiles.filter((e, i, a) => a.lastIndexOf(e) === i);

    return {
        regex: scanRegexes.join('|').replace(/{word}/g, word),
        fileTypes: scanFiles,
    };

    // var scanRegexes = ['bac'];
    // return scanRegexes.join('|').replace(/{word}/g, word);
}

exports.scanRegex = scanRegex;