import * as childProcess from "child_process";
import {Dependency} from "./PackageWatcher";

export class TypingsService {
    constructor(private rootPath: string) { }

    install(dependency: Dependency, isDev: Boolean = false, stateCallback: StateCallback, callback: any) {
        const installCommands = Object.keys(dependency).map((key) => (callback) => this.installDependency(key, isDev, stateCallback, this.rootPath, callback))
        if (installCommands && installCommands.length) {
            let successCount = 0;
            const run = (index) => {
                installCommands[index]((success) => {
                    if (success) {
                        successCount++;
                    }
                    const newIndex = index + 1;
                    (installCommands.length > newIndex) ?
                        run(newIndex) :
                        callback(successCount)
                }
                );
            }
            run(0);
        } else {
            callback(0);
        }
    }


    installDependency(key: string, isDev: Boolean = false, stateCallback: StateCallback, rootPath: string, callback: Callback) {
        stateCallback(`Installing Typings package '${key}'\n`);

        let saveString = "--save";
        if (isDev) {
            saveString = "--save-dev";
        }

        let command = `typings install dt~${key} --global ` + saveString;

        childProcess.exec(command, { cwd: rootPath, env: process.env }, (error, stdout, sterr) => {
            if (sterr && sterr.indexOf('typings ERR!') > -1) {
                if (sterr.match(/typings ERR! message Unable to find "[^"]*" \("dt"\) in the registry/g)) {
                    stateCallback(`Typings for package '${key}' not found\n\n`);
                } else {
                    stateCallback(sterr);
                }
                callback(false);
            } else {
                stateCallback(stdout);
                stateCallback(`Successfully installed Typings for package '${key}'\n\n`);
                callback(true);
            }
        });
    }


    uninstall(dependency: Dependency, isDev: Boolean = false, stateCallback: StateCallback, callback: any) {
        const uninstallCommands = Object.keys(dependency).map((key) => (callback) => this.uninstallDependency(key, isDev, stateCallback, this.rootPath, callback))
        if (uninstallCommands && uninstallCommands.length) {
            let successCount = 0;
            const run = (index) => {
                uninstallCommands[index]((success) => {
                    if (success) {
                        successCount++;
                    }
                    const newIndex = index + 1;
                    (uninstallCommands.length > newIndex) ?
                        run(newIndex) :
                        callback(successCount)
                });
            }
            run(0);
        } else {
            callback(0);
        }
    }

    uninstallDependency(key: string, isDev: Boolean = false, stateCallback: StateCallback, rootPath: string, callback: Callback) {
        stateCallback(`Uninstalling Typings package '${key}'\n`);

        let saveString = "--save";
        if (isDev) {
            saveString = "--save-dev";
        }

        let command = `typings uninstall ${key} --global ` + saveString;

        childProcess.exec(command, { cwd: rootPath, env: process.env }, (error, stdout, sterr) => {
            if (sterr && sterr.indexOf('typings ERR!') > -1) {
                if (sterr.match(/typings ERR! message Typings for "[^"]*" are not listed in global.*dependencies/g)) {
                    stateCallback(`Typings for package '${key}' not installed\n\n`);
                } else {
                    stateCallback(sterr);
                }
                callback(false);
            } else {
                stateCallback(stdout);
                stateCallback(`Successfully uninstalled Typings for package '${key}'\n\n`);
                callback(true);
            }
        });
    }
}

export interface StateCallback {
    (state): any;
}

export interface Callback {
    (success): boolean
}