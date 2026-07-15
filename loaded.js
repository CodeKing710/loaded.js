/**
 * The Dependency Factory
 * 
 * contains the code to add dependencies on or before pageload
 * all you need is to include the js file with the function
 * at the top put the dependency factory, then the file with your function
 * at the beginning of your function file, run the addDeps function
 * passing in a boolean on whether to pageload or not
 * and the name of the dependency or dependencies. It can accept
 * any amount of dependencies. It also has a predefined MAIN function
 * it will run prior to pageload, do what you will with that.
 * IF MAIN isn't defined it will warn you that it isn't but that doesn't
 * affect the main execution
 */

/* ------------------------------------ */

// Attempt to find a MAIN function
let MAIN;
try {
  MAIN = await import('/js/main.js')
} catch (e) {
  try {
    MAIN = await import('./main.js')
  } catch (e) {
    console.warn('MAIN not defined, skipping execution attempt')
  }
}

/** PRIVATE FUNCTION AND VARS */

const safeCtx = typeof globalThis !== "undefined" ? globalThis : this

function runMain(){
  if(typeof MAIN === 'function') {
    MAIN()
  }
}

const __DEPENDENCIES__ = [
  {
    func: runMain,
    onload: false
  }
]

let __INSTALLED__ = false

/* ------------------------------------ */


//Dependency mutators
/**
 * 
 * @param {Function} func - Callback to execute
 * @param {boolean} [onload=false] - Defines execution delay for DOM
 * @returns {Object} structured dependency block 
 */
export function createDep(func, onload = false) {
  if(typeof func !== "function") {
    console.error("DEPENDENCY ",func, " NOT FOUND")
    return null
  }
  return {
    func: func,
    onload: !!onload
  }
}

/**
 * 
 * @param  {...(Function|Object)} deps - List of functions or dependency objects to add to the dependency list 
 */
export function addDeps(...deps) {
  for(let i = 0; i < deps.length; i++) {
    const item = deps[i]
    if (!item) continue

    if (typeof item === "function") {
      __DEPENDENCIES__.push(createDep(item))
    } else if (typeof item === "object" && item.func) {
      __DEPENDENCIES__.push(item)
    } else {
      console.error("Invalid dependency: ", item)
    }
  }
}

/**
 * 
 * @param  {...Function} dep_names - List of function names to remove from the dependency list
 */
export function rmDeps(...dep_names) {
  //Loop through the dependency list to see if the names to remove are in it, if so remove them
  for(let i = __DEPENDENCIES__.length - 1; i >= 0; i--) {
    const dep = __DEPENDENCIES__[i]
    if(dep_names.includes(dep.func)) {
      __DEPENDENCIES__.splice(i, 1)
    }
  }
}

/**
 * Insatlls and executes the dependencies in the __DEPENDENCIES__ list
 * Differentiates between Node and Browser environments, executing the dependencies accordingly
 */
export function installDeps() {
  if(__INSTALLED__) return
  __INSTALLED__ = true

  const loadList = []
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined"
  //Loop through the dependencies and assign the different types
  for(let i = 0; i < __DEPENDENCIES__.length; i++) {
    const dep = __DEPENDENCIES__[i]
    if(dep.onload) {
      //Assign to the list to be looped through later
      loadList.push(dep.func);
    } else {
      //Run right away since it doesn't rely on pageload
      dep.func.call(safeCtx);
    }
  }

  if(loadList.length === 0) return

  if(isBrowser) {
    if(document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        for(let i = 0; i < loadList.length; i++) {
          loadList[i].call(safeCtx);
        }
      })
    } else {
      for(let i = 0; i < loadList.length; i++) {
        loadList[i].call(safeCtx);
      }
    }
  } else {
    //If not in a browser, just run the functions
    for(let i = 0; i < loadList.length; i++) {
      loadList[i].call(safeCtx);
    }
  }
}
