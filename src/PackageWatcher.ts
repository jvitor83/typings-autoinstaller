export interface Dependency {
    [packageName: string]: string;
}

export interface Package {
    dependencies: Dependency;
    devDependencies: Dependency;
}

interface DetectedChangesCallback {
    (newPackages: Package, deletedPackes: Package): any;
}

export class PackageWatcher {
    constructor(private packageJson: Package) {
    }

    changed(changedPackage: Package, detectedChangesCallback: DetectedChangesCallback) {
        let newPackages: Package = { dependencies: {}, devDependencies: {} };
        let deletedPackes: Package = { dependencies: {}, devDependencies: {} };

        for (let key in changedPackage.dependencies) {
            if (this.exisitsPackage(this.packageJson.dependencies, key)) {
                newPackages.dependencies[key] = changedPackage.dependencies[key];
            }
        }

        for (let key in changedPackage.devDependencies) {
            if (this.exisitsPackage(this.packageJson.devDependencies, key)) {
                newPackages.devDependencies[key] = changedPackage.devDependencies[key];
            }
        }

        if(this.packageJson.devDependencies == undefined)
        {
            for (let key in changedPackage.devDependencies) 
            {
                newPackages.devDependencies[key] = changedPackage.devDependencies[key];
            }
        }


        if(this.packageJson.dependencies == undefined)
        {
            for (let key in changedPackage.dependencies) 
            {
                newPackages.dependencies[key] = changedPackage.dependencies[key];
            }
        }


        if(changedPackage.dependencies == undefined)
        {
            for (let key in this.packageJson.dependencies) 
            {
                deletedPackes.dependencies[key] = this.packageJson.dependencies[key];
            }
        }

        if(changedPackage.devDependencies == undefined)
        {
            for (let key in this.packageJson.devDependencies) 
            {
                deletedPackes.devDependencies[key] = this.packageJson.devDependencies[key];
            }
        }

        for (let key in this.packageJson.dependencies) {
            if (this.exisitsPackage(changedPackage.dependencies, key)) {
                deletedPackes.dependencies[key] = this.packageJson.dependencies[key];
            }
        }

        for (let key in this.packageJson.devDependencies) {
            if (this.exisitsPackage(changedPackage.devDependencies, key)) {
                deletedPackes.devDependencies[key] = this.packageJson.devDependencies[key];
            }
        }

        this.packageJson = changedPackage;
        detectedChangesCallback(newPackages, deletedPackes);
    }

    private exisitsPackage(dependencies: Dependency, key: string): boolean {
        if(dependencies != null)
        {
            return !dependencies.hasOwnProperty(key);
        }
        return false;
    }
}