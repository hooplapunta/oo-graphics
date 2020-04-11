/* This is the generic definition of constraints. You should flesh this out to
make it actually work. 

It is fine to change this specification - it is just for guidance.
*/

class Dependent {
    constructor(constraint, propertyName) {
        this.constraint = constraint;
        this.propertyName = propertyName;
    }

    isEquals(other) {
        return this.constraint == other.constraint && this.propertyName == other.propertyName;
    }
}

class DependencyOn {
    constructor(object, propertyName) {
        this.object = object;
        this.propertyName = propertyName;
    }

    isEquals(other) {
        return this.object == other.object && this.propertyName == other.propertyName;
    }
}

class Constraint {

    /* creates a new constraint object to put into an attribute of an object.
       Your design may require the programmer to provide more or less information.
    */
    constructor(originObject, originPropertyName, initialValue = 0, func, dependencyOnList = []) {
        this.originObject = originObject;
        this.originPropertyName = originPropertyName;
        this.func = func;
        this.dependencyOnList = dependencyOnList;

        // check if the expected number of parameters in the provided func
        // matches the number of dependencies provided
        // expect a 1 to 1 match, no fancy situations or ES6 features for now
        if (this.func.length != this.dependencyOnList.length) {
            console.log(this.func.length +" not " + this.dependencyOnList.length)
            throw "The number of parameters exepcted in this constraint" 
                + "does not match the number of arguments referenced.";
        }

        this.value = initialValue;
        this.changed = true;

        // need to go through the dependObjectList and set the usesMy_xxxx for each one
        
        this.dependencyOnList.forEach(d => {
            d.object.dependents.push(new Dependent(this, d.propertyName));
        });
    }

    invalidate() {
        // check if the dependency is safe before invalidating
        this.dependencyOnList.forEach(d => {
            // check if there is a cycle after adding
            let visited = new Set();
            let toVisit = new Set();
            if (this.hasLoop(d, visited, toVisit)) {
                throw "There is a loop from a dependency on " + d.object.constructor.name + "." + d.propertyName;
            }
        });

        this.changed = true;
        
        // invalidate dependents if they use the value of this property
        this.originObject.dependents.forEach(d => {
            if (d.propertyName == this.originPropertyName) {
                d.constraint.invalidate();
            }
        });
    }

    hasLoop(dependencyOn, visited, toVisit) {
        let isVisited = false;
        visited.forEach(p => {
            if (p.isEquals(dependencyOn)) {
                isVisited = true;
            }
        });

        if (!isVisited) {
            visited.add(dependencyOn);
            toVisit.add(dependencyOn);

            let propertyValue = dependencyOn.object["_" + dependencyOn.propertyName];
            if (propertyValue instanceof Constraint) {
                // if it is a constraint
                // loop through what this constraint is dependentOn
                // recurse to check
                let isFound = false;

                propertyValue.dependencyOnList.forEach(d => {
                    let isNextVisited = false;
                    visited.forEach(p => {
                        if (p.isEquals(d)) {
                            isNextVisited = true;
                        }
                    });

                    let isNextToVisit = false;
                    toVisit.forEach(v => {
                        if (v.isEquals(d)) {
                            isNextToVisit = true;
                        }
                    });
                    
                    if(!isNextVisited && this.hasLoop(d, visited, toVisit)) {
                        isFound = true;
                    } else if (isNextToVisit) {
                        isFound = true;
                    }
                });

                if (isFound) {
                    return true;
                }

            } else {
                // not a constraint, then there is no loop down this path, let recursion expire
            }
        }

        toVisit.forEach(v => {
            if (v.isEquals(dependencyOn)) {
                toVisit.delete(v);
            }
        });
        return false;
    }

    /* Evaluates the constraint function if needed and returns the value. May return
       the value immediately if the constraint doesn't need to be re-evaluated.
    */
    valueOf() {
        if (this.changed) {
            // check if the dependency is safe before evaluation
            this.dependencyOnList.forEach(d => {
                // check if there is a cycle after adding
                let visited = new Set();
                let toVisit = new Set();
                if (this.hasLoop(d, visited, toVisit)) {
                    throw "There is a loop from a dependency on " + d.object.constructor.name + "." + d.propertyName;
                }
            });

            // re-evaluate our list of dependencies to feed
            // into the the provided function
            var params = this.dependencyOnList.map(d => d.object[d.propertyName]);
            // console.log("eval")
            // console.log(params);

            this.value = this.func(...params);
            this.changed = false;
        }
        return this.value;
    }


    /* value for the variable this constraint was in was set. This might remove the constraint in a formula
       constraint system, or set the local value and cause dependency invalidating in a multi-way constraint system
       */
    set(newVal) {
        // not used
        // don't allow for two-way setting
        this.value = newVal;
    }
}