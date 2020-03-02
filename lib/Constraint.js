/* This is the generic definition of constraints. You should flesh this out to
make it actually work. 

It is fine to change this specification - it is just for guidance.
*/

class Constraint {

    /* creates a new constraint object to put into an attribute of an object.
       Your design may require the programmer to provide more or less information.
    */
    constructor(initialValue = 0, func, dependObjectList = []) {
        this.func = func;
        this.dependObjectList = dependObjectList;
        this.value = initialValue;
        this.changed = false;
        // need to go through the dependObjectList and set the usesMy_xxxx for each one

        this.dependObjectList.forEach(obj => {
            obj.dependents.push(this);
        });
    }

    /* Evaluates the constraint function if needed and returns the value. May return
       the value immediately if the constraint doesn't need to be re-evaluated.
    */
    valueOf () {
        if (this.changed) {
            this.value = this.func();
            this.changed = false;
        } else {
            return this.value;
        }
    }

    // not used
    // don't allow for two-way setting

    /* value for the variable this constraint was in was set. This might remove the constraint in a formula
       constraint system, or set the local value and cause dependency invalidating in a multi-way constraint system
       */
    set (newVal) {
        this.value = newVal;
    }
}