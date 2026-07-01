# Loaded.js

Loaded.js contains functions to create, add, remove, and install local JavaScript dependencies before your application fully loads. It makes sure to delay the animation frame of the page until all dependencies are loaded into memory.

## Usage

This file must be added like so: `<script type="module" src="<path>/loaded.js"></script>`. Note that this is an ESM module so anything using this is also an ESM module and must be treated as such.

This **does** play nice with non-ESM JavaScript as well as TypeScript integration, just know that quirks may occur and for TypeScript you must define your compiler options to

```json
"allowJs": true, "checkJs": false
```

in your *tsconfig.\*.json* file that compiles the TypeScript for the client-side. This can be used in NodeJS/TS as well, minus the capacity for utilizing `window` or anything DOM related.

The loaded.js functions have checks in place to make sure DOM functions aren't used, just ensure you use the right dependency adding function if you'd like to use a dependency as a post-DOM-load script.

Include this file in your scripts **FIRST**! From there, you can include your own functions from JS files or inline script definitions using `addDeps(...<dep_names>)` to your included dependencies. Make you have `import { addDeps } from './loaded.js'` as one of your first lines of code in your dependency.

If you want to use this to create a dependency it is quite easy. You can either pass a function directly to `addDeps()` and it will create the dependency for you (note this will not allow you to define if it runs on DOM loaded or not), or you can use `createDep(func, onload)` to define the dependency object and subsequently pass that to `addDeps()`, or define it inline like so;

```js
//Add dependency
addDeps(createDep(func))

//Optionally, add true as the second argument for DOM load
addDeps(createDep(func, true))

//Alternative: Define the object inline
addDeps({func: your_func, onload: true|false})
```

If you for some reason want to remove a dependency from the inclusion list, you can use `rmDeps(...<dep_names>)` to remove dependency(s) from the list.

Once you are ready, your first line of any main JavaScript that runs after including all the libraries must always be;

```js
import { installDeps } from './loaded.js'
installDeps()
```

This ensures the dependencies are installed and instantiated for use down the line.
