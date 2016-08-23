"use strict";

import * as vscode from "vscode";
import {Package, PackageWatcher} from "./PackageWatcher";
import {TypingsService} from "./TypingsService";

let npmPackageWatcher: PackageWatcher;
let bowerPackageWatcher: PackageWatcher;
let outputChannel: vscode.OutputChannel;
let typingsService: TypingsService;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel("Typings AutoInstaller Watcher");
    context.subscriptions.push(outputChannel);

    startNpmWatch(context);
    startBowerWatch(context);

    var installAllDependenciesCommand = vscode.commands.registerCommand('typings.installAllDependencies', (context) => {
        installAllDependencies(context);
    });
    context.subscriptions.push(installAllDependenciesCommand);
}

function installAllDependencies(context: vscode.ExtensionContext) {
    let npmPath = vscode.workspace.rootPath + "/package.json";
    vscode.workspace.openTextDocument(npmPath).then((file) => {
        let packageJson: Package = JSON.parse(file.getText());
        // Install
        installPackages(packageJson, (count) => {
            writeOutput(`Installed Typings of ${count} npm package(s)\n`);
            readBower();
        }, true);
    }, () => {
        readBower();
    });

    const readBower = () => {
        let bowerPath = vscode.workspace.rootPath + "/bower.json";
        vscode.workspace.openTextDocument(bowerPath).then((file) => {
            let packageJson: Package = JSON.parse(file.getText());
            // Install
            installPackages(packageJson, (count) => {
                writeOutput(`Installed Typings of ${count} bower package(s)\n`);
            });
        });
    }
}

function startNpmWatch(context: vscode.ExtensionContext) {
    let path = vscode.workspace.rootPath + "/package.json";

    initNpmWatcher(path);

    let watcher = vscode.workspace.createFileSystemWatcher(path);
    watcher.onDidChange((e) => {
        if (isNpmWatcherDeactivated()) {
            initNpmWatcher(path);
        }

        vscode.workspace.openTextDocument(path).then((file) => {
            let packageJson: Package = JSON.parse(file.getText());
            npmPackageWatcher.changed(packageJson, (newPackages, deletedPackes) => {
                // Install
                installPackages(newPackages, (count) => {
                    if (count) writeOutput(`Installed Typings of ${count} npm package(s)\n`)
                    // Uninstall
                    uninstallPackages(deletedPackes, (count) => {
                        if (count) writeOutput(`Uninstalled Typings of ${count} npm package(s)\n`)
                    });
                });
            });
        });
    });

    context.subscriptions.push(watcher);
}

function isNpmWatcherDeactivated() {
    return !npmPackageWatcher;
}

function initNpmWatcher(path: string) {
    vscode.workspace.openTextDocument(path).then((file) => {
        if (file != null) {
            let packageJson: Package = JSON.parse(file.getText());
            npmPackageWatcher = new PackageWatcher(packageJson);
            typingsService = new TypingsService(vscode.workspace.rootPath);
        }
    });
}



function startBowerWatch(context: vscode.ExtensionContext) {
    let path = vscode.workspace.rootPath + "/bower.json";

    initBowerWatcher(path);

    let watcher = vscode.workspace.createFileSystemWatcher(path);
    watcher.onDidChange((e) => {
        if (isBowerWatcherDeactivated()) {
            initBowerWatcher(path);
        }

        vscode.workspace.openTextDocument(path).then((file) => {
            let bowerJson: Package = JSON.parse(file.getText());
            bowerPackageWatcher.changed(bowerJson, (newPackages, deletedPackes) => {
                // Install
                installPackages(newPackages, (count) => {
                    if (count) writeOutput(`Installed Typings of ${count} bower package(s)\n`)
                    // Uninstall
                    uninstallPackages(deletedPackes, (count) => {
                        if (count) writeOutput(`Uninstalled Typings of ${count} bower package(s)\n`)
                    });
                });
            });
        });
    });

    context.subscriptions.push(watcher);
}

function installPackages(packageJson: Package, callback: any, installEngines: boolean = false) {
    // if(installEngines){
    //     typingsService.install(packageJson.engines || {}, false, writeOutput, (counte) => {});
    // }
    
    typingsService.install(packageJson.dependencies || {}, false, writeOutput, (counta) => {
        typingsService.install(packageJson.devDependencies || {}, true, writeOutput, (countb) => {
            typingsService.install(packageJson.engines || {}, false, writeOutput, (countc) => callback(counta + countb + countc));
        });
    });

}

function uninstallPackages(packageJson: Package, callback: any) {

    typingsService.uninstall(packageJson.dependencies || {}, false, writeOutput, (counta) => {
        typingsService.uninstall(packageJson.devDependencies || {}, true, writeOutput, (countb) => {
            typingsService.uninstall(packageJson.engines || {}, false, writeOutput, (countc) => callback(counta + countb + countc));
        });
    });

    // typingsService.uninstall(packageJson.dependencies, false, writeOutput, (counta) => {
    //     typingsService.uninstall(packageJson.devDependencies, true, writeOutput, (countb) => callback(counta + countb));
    // });
}

function isBowerWatcherDeactivated() {
    return !bowerPackageWatcher;
}

function initBowerWatcher(path: string) {
    vscode.workspace.openTextDocument(path).then((file) => {
        let bowerJson: Package = JSON.parse(file.getText());
        bowerPackageWatcher = new PackageWatcher(bowerJson);
        typingsService = new TypingsService(vscode.workspace.rootPath);
    });
}


function writeOutput(message: string) {
    outputChannel.append(message);
}

export function deactivate() {
}
