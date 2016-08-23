export interface Dependency {
    [packageName: string]: string;
}

export interface Package {
    engines: Dependency;
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
        let newPackages: Package = { dependencies: {}, devDependencies: {}, engines: {} };
        let deletedPackes: Package = { dependencies: {}, devDependencies: {}, engines: {} };

        //engines
        for (let key in changedPackage.engines) {
            if (this.exisitsPackage(this.packageJson.engines, key)) {
                newPackages.engines[key] = changedPackage.engines[key];
            }
        }

        if(this.packageJson.engines == undefined)
        {
            for (let key in changedPackage.engines) 
            {
                newPackages.engines[key] = changedPackage.engines[key];
            }
        }


        if(changedPackage.engines == undefined)
        {
            for (let key in this.packageJson.engines) 
            {
                deletedPackes.engines[key] = this.packageJson.engines[key];
            }
        }


        for (let key in this.packageJson.engines) {
            if (this.exisitsPackage(changedPackage.engines, key)) {
                deletedPackes.engines[key] = this.packageJson.engines[key];
            }
        }
        //engines
        


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