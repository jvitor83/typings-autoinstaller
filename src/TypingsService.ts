import * as childProcess from "child_process";
import {Dependency} from "./PackageWatcher";

export class TypingsService {
    constructor(private rootPath: string) { }

    install(dependency: Dependency, isDev: Boolean = false, stateCallback: StateCallback) {
        for (let key in dependency) {
            stateCallback(`Installing Typings package ${key}\n`);

            let saveString = "--save";
            if(isDev)
            {
                saveString = "--save-dev";
            }

            let command = `typings install ${key} --ambient ` + saveString;

            let installProcess = childProcess.exec(command, { cwd: this.rootPath, env: process.env });
            installProcess.stderr.on("data", (stateMessage) => {
                stateCallback(stateMessage);
            });

            installProcess.stdout.on("data", (stateMessage) => {
                stateCallback(stateMessage);
            });
        }
    }

    uninstall(dependency: Dependency, isDev: Boolean = false, stateCallback: StateCallback) {
        for (let key in dependency) {
            stateCallback(`Uninstalling Typings package ${key}\n`);

            let saveString = "--save";
            if(isDev)
            {
                saveString = "--save-dev";
            }

            let command = `typings uninstall ${key} --ambient ` + saveString;
            
            let installProcess = childProcess.exec(command, { cwd: this.rootPath, env: process.env });
            installProcess.stderr.on("data", (stateMessage) => {
                stateCallback(stateMessage);
            });

            installProcess.stdout.on("data", (stateMessage) => {
                stateCallback(stateMessage);
            });
        }
    }
}

export interface StateCallback {
    (state): any;
}