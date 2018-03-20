const vscode = require('vscode'),
    search = require('./search'),
    path = require('path'),
    {InformationMessage, WarningMessage, ErrorMessage } = require('./messages');

function openLocation(location) {
    return vscode.workspace.openTextDocument(location.path).then(function (doc) {
        return vscode.window.showTextDocument(doc).then(function (editor) {
            var pos = new vscode.Position(location.line, location.column);
            var range = doc.getWordRangeAtPosition(pos);
            editor.selection = new vscode.Selection(range.start.line, range.start.character, range.start.line, range.start.character);
            editor.revealRange(range, vscode.TextEditorRevealType.Default);
        });
    });
}

function activate(context) {
    var disposable = vscode.commands.registerTextEditorCommand('extension.movetodefinitions', function (editor) {
        try {
            var document = editor.document,
                selection = editor.selection,
                pos = selection.active,
                range = document.getWordRangeAtPosition(pos),
                word = document.getText(range),
                extensionToScanRegex = path.extname(document.fileName),
                arr = word.split('\n');
                
            if (arr.length > 1) {
                throw new InformationMessage("There's no word selected");
            }
            if (document.fileName.indexOf("Untitled") >= 0) {
                throw new WarningMessage("The file must be saved first");
            }
            
            search.find(extensionToScanRegex, word).then(response => {
                if (!response.err) {
                    var locations = response.locations;

                    if (locations.length === 1) {
                        return openLocation(locations[0]);
                    }
                    var picks = locations.map(l => {
                        return {
                            label: vscode.workspace.asRelativePath(l.path) + ":" + (l.line + 1),
                            description: l.path,
                            detail: l.text,
                            location: l
                        };
                    });
                    return vscode.window.showQuickPick(picks).then(function (pick) {
                        return pick && openLocation(pick.location);
                    });
                } else {
                    return null;
                }
            });
        } catch (e) {
            e.show && e.show();
            console.log(e);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;