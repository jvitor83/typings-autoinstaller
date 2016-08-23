import * as assert from "assert";
import * as vscode from "vscode";
import {Package, PackageWatcher} from "../src/PackageWatcher";

suite("package-watcher Tests", () => {

    test("Zero changed packages", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7",
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("One new dependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7",
                "jasmine": "*"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(newPackages.dependencies["jasmine"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 1);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("Two new dependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7",
                "jasmine": "*",
                "jasmine-node": "*"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(newPackages.dependencies["jasmine"], "*");
            assert.equal(newPackages.dependencies["jasmine-node"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 2);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("One new devDependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(newPackages.devDependencies["vscode"], "^0.11.0");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 1);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("Two new devDependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0",
                "typescript": "*"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(newPackages.devDependencies["vscode"], "^0.11.0");
            assert.equal(newPackages.devDependencies["typescript"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 2);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("One deleted dependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
            },
            devDependencies: {
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(deletedPackes.dependencies["json2ts"], "^0.0.7");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 1);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("Two deleted dependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7",
                "rxjs": "*"
            },
            devDependencies: {
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
            },
            devDependencies: {
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(deletedPackes.dependencies["json2ts"], "^0.0.7");
            assert.equal(deletedPackes.dependencies["rxjs"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 2);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 0);
        });
    });

    test("One deleted devDependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(deletedPackes.devDependencies["vscode"], "^0.11.0");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 1);
        });
    });

    test("Two deleted devDependency package", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0",
                "typescript": "*"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(deletedPackes.devDependencies["vscode"], "^0.11.0");
            assert.equal(deletedPackes.devDependencies["typescript"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 0);
            assert.equal(Object.keys(newPackages.devDependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 0);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 2);
        });
    });

    test("Cross dependencies changed", () => {
        let packageJson: Package = {
            dependencies: {
                "json2ts": "^0.0.7"
            },
            devDependencies: {
                "vscode": "^0.11.0",
                "typescript": "*"
            },
            engines: {}
        };

        let changedPackageJson: Package = {
            dependencies: {
                "rxjs": "*"
            },
            devDependencies: {
                "vscode": "^0.11.0",
                "gulp": "*"
            },
            engines: {}
        };

        let packageWatcher = new PackageWatcher(packageJson);
        packageWatcher.changed(changedPackageJson, (newPackages, deletedPackes) => {
            assert.equal(newPackages.dependencies["rxjs"], "*");
            assert.equal(newPackages.devDependencies["gulp"], "*");
            assert.equal(deletedPackes.dependencies["json2ts"], "^0.0.7");
            assert.equal(deletedPackes.devDependencies["typescript"], "*");
            assert.equal(Object.keys(newPackages.dependencies).length, 1);
            assert.equal(Object.keys(newPackages.devDependencies).length, 1);
            assert.equal(Object.keys(deletedPackes.dependencies).length, 1);
            assert.equal(Object.keys(deletedPackes.devDependencies).length, 1);
        });
    });
});