const vscode = require('vscode');

class InformationMessage extends Error {
    constructor(message) {
        super(message);
    }
    show() {
        vscode.window.showInformationMessage(this.message, 1500);
    }
};

class WarningMessage extends Error {
    constructor(message) {
        super(message);
    }
    show() {
        vscode.window.showWarningMessage(this.message, 1500);
    }
};

class ErrorMessage extends Error {
    constructor(message) {
        super(message);
    }
    show() {
        vscode.window.showErrorMessage(this.message, 1500);
    }
};

module.exports = {
    InformationMessage,
    ErrorMessage,
    WarningMessage
}