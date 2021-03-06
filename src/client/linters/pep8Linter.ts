'use strict';

import * as path from 'path';
import * as baseLinter from './baseLinter';
import * as settings from './../common/configSettings';
import {OutputChannel} from 'vscode';

const PEP_COMMANDLINE = " --format='%(row)d,%(col)d,%(code)s,%(code)s:%(text)s'";

export class Linter extends baseLinter.BaseLinter {
    constructor(rootDir: string, pythonSettings: settings.IPythonSettings, outputChannel:OutputChannel) {
        super("pep8", pythonSettings, outputChannel);
    }

    public runLinter(filePath: string, txtDocumentLines: string[]): Promise<baseLinter.ILintMessage[]> {
        if (!this.pythonSettings.linting.pep8Enabled) {
            return Promise.resolve([]);
        }

        var pep8Path = this.pythonSettings.linting.pep8Path;
        var cmdLine = `${pep8Path} ${PEP_COMMANDLINE} ${filePath}`;
        return new Promise<baseLinter.ILintMessage[]>(resolve => {
            this.run(cmdLine, filePath, txtDocumentLines).then(messages=> {
                //All messages in pep8 are treated as warnings for now
                messages.forEach(msg=> {
                    msg.severity = baseLinter.LintMessageSeverity.Information;
                });

                resolve(messages);
            });
        });
    }
}
