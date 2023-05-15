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
/** PRIVATE FUNCTION FOR PREDEF FUNCS */
function runMain(){
    if(typeof MAIN == "undefined") {
        //Dont run
        console.warn("MAIN NOT DEFINED");
    } else {
        MAIN();
    }
}
/* ------------------------------------ */

let __DEPENDENCIES__ = [
    {
        func: runMain,
        onload: false
    }
];

//Dependency mutators
function addDeps(onload, ...dep_names) {
    if(typeof onload !== "boolean") {
        //Use onload backup as false and grab the odd one out
        __DEPENDENCIES__.push({func: onload, onload: false});
        for(let i = 0; i < dep_names.length; i++) {
            let dep_name = dep_names[i];
            if(typeof dep_name == "function") {
                __DEPENDENCIES__.push({func: dep_name, onload: false});
            } else {
                console.error("DEPENDENCY ",dep_name, " NOT FOUND");
            }
        }
    } else {
        for(let i = 0; i < dep_names.length; i++) {
            let dep_name = dep_names[i];
            if(typeof dep_name == "function") {
                __DEPENDENCIES__.push({func: dep_name, onload: onload});
            } else {
                console.error("DEPENDENCY ",dep_name, " NOT FOUND");
            }
        }
    }
    
}
function rmDeps(...dep_names) {
    //Loop through each index try and find proper dep index
    for(let i = 0; i < __DEPENDENCIES__.length; i++) {
        for(let j = 0; j < dep_names.length; j++) {
            if(__DEPENDENCIES__[i].func == dep_names[j]) {
                //The dependency exists splice the original array
                __DEPENDENCIES__.splice(i,i);
            }
        }
    }
}

// Installation script
//Runs before DOM is accessible, DOM may or may not be ready
//Use "true" for run at pageload
function installDeps() {
    let loadList = [];
    //Loop through the dependencies and assign the different types
    for(let i = 0; i < __DEPENDENCIES__.length; i++) {
        if(__DEPENDENCIES__[i].onload) {
            //Assign to the list to be looped through later
            loadList.push(__DEPENDENCIES__[i].func);
        } else {
            //Run right away since it doesn't rely on pageload
            __DEPENDENCIES__[i].func.call(window);
        }
    }
    //Set window.onload to the function loadList loop
    window.onload = function() {
        for(let i = 0; i < loadList.length; i++) {
            loadList[i].call(window);
        }
    }
}