"use strict";

import * as vscode from "vscode";
import {Package, PackageWatcher} from "./PackageWatcher";
import {TypingsService} from "./TypingsService";

let npmPackageWatcher: PackageWatcher;
let bowerPackageWatcher: PackageWatcher;
let outputChannel: vscode.OutputChannel;
let typingsService: TypingsService;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel("Package watcher");
    context.subscriptions.push(outputChannel);

    startNpmWatch(context);
    startBowerWatch(context);
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
                typingsService.install(newPackages.dependencies, false, writeOutput);
                typingsService.install(newPackages.devDependencies, true, writeOutput);

                // Uninstall
                typingsService.uninstall(deletedPackes.dependencies, false, writeOutput);
                typingsService.uninstall(deletedPackes.devDependencies, true, writeOutput);
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
        if(file != null)
        {
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
                typingsService.install(newPackages.dependencies, false, writeOutput);
                typingsService.install(newPackages.devDependencies, true, writeOutput);

                // Uninstall
                typingsService.uninstall(deletedPackes.dependencies, false, writeOutput);
                typingsService.uninstall(deletedPackes.devDependencies, true, writeOutput);
            });
        });
    });

    context.subscriptions.push(watcher);
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