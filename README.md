# Package watcher for Visual Studio Code

> Breaking changes on [Typings](https://github.com/typings/typings) from version 0.x to version 1.x.

> - Only update the extension to (this) version 1.x if you have Typings version 1.x installed globally (consider the breaking change on your projects).

> More info at: [https://github.com/typings/typings](https://github.com/typings/typings)

## Installation 
You can browse and install extensions from within VS Code. Press `Ctrl+P` and narrow down the list commands by typing `ext install typings-autoinstaller`.

### Usage
Any time you save either package.json or bower.json the typings packages will be installed/uninstalled automatically in the background.

#### Commands
To initially install all typings of a project, open the Command Palette with <kbd>F1</kbd> and type in `Typings: Install definitions for all dependencies`, press <kbd>Enter</kbd> to select it.

### Contributing
Feel free to submit a pull request if you find any bugs (to see a list of active issues, visit the [Issues section](https://github.com/jvitor83/typings-autoinstaller/issues)).
Please make sure all commits are properly documented.

### License
MIT-licensed

** Enjoy! **