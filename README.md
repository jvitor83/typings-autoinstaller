# Typescript - Typings autoinstaller
Project home - [https://github.com/jvitor83/typings-autoinstaller](https://github.com/jvitor83/typings-autoinstaller)

## Installation 
You can browse and install extensions from within VS Code. Press `Ctrl+P` and narrow down the list commands by typing `ext install typings-autoinstaller`.

### Usage
Any time you save either package.json or bower.json the typings packages will be installed/uninstalled automatically in the background.

#### Commands
To initially install all typings of a project, open the Command Palette with <kbd>F1</kbd> and type in `Typings: Install definitions for all dependencies`, press <kbd>Enter</kbd> to select it.

#### How it works
It watch for dependencies, devDependencies and engines and use the name of those packages to run `typings install dt~xxxxxxx --global --save`.
> More info at: [https://github.com/typings/typings](https://github.com/typings/typings) 

### Contributing
Feel free to submit a pull request if you find any bugs (to see a list of active issues, visit the [Issues section](https://github.com/jvitor83/typings-autoinstaller/issues)).
Please make sure all commits are properly documented.

### License
MIT-licensed

** Enjoy! **