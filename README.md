# SCSS-Starter-Kit

### Installation
1. Make sure you have the latest `Node.js` LTS installed. [Download](https://nodejs.org/en/download/)
2. Open the command line and install `Gulp CLI` globally ones if not installed yet. Use `npm install gulp-cli -g`.
3. `cd` into your project folder in command line where `package.json` file located or open the folder in your explorer, right mouse click with pressed `Shift` key and choose `Open command line here`.
4. Install all dependencies with `npm install`.
5. Change variable `path` if you need. For example, I use this path for `OpenCart`:
```
const path = './catalog/view/theme/default/stylesheet/';
```
6. Repeat steps 3, 4 and 5 in every project.

### Usage
* For **development** run `gulp` in your project where `gulpfile.js` is located. It runs watch task and generates a new `style.css` with sourcemaps whenever you change and save `.scss` files. `Autoprefixer` is disabled.
* For **production** run `gulp build` in the command line. It removes sourcemaps, turns on `autoprefixer`.

Also you can use your IDE panel. PHPStorm has a good one. Just double click the task name to run it or press &#9658; button to run the default one.

### Styles structure
```
styles (or your path)
├── css
|    ├─ style.css
|    └─ style.css.map
├── scss
|    ├─ helpers
|    ├─ folder1
|    └─ folder2
|    main.scss

```

### Other instructions
##### Naming pattern for `.scss` files
```
_variables.scss
_buttons.scss
```

##### How to include these files in `main.scss`
```
@import 'variables.scss';
@import 'buttons.scss';
```

Notice! Order matters.
