/* 
Each of these classes needs to be put into its own class in your code. 
There are all collected together here just for brevity. You should modify
the body of all the methods to do the right things.
*/

class GraphicalObject {

    /* creates an empty object at a location */
    constructor(x = 0, y = 0) {
        // this.originalX = x;
        // this.originalY = y;
        this._x = x;
        this._y = y;
        this.group = null;

        // for constraints
        this.dependents = [];
    }

    propagate(propertyName) {
        //do something to tell each of the constraints in listOfUsers, that the value they depend on is now outofdate
        // in the real implementation, there probably needs to be a lot more parameters and state
    
        for (let i = 0; i < this.dependents.length; i++) {
            const dependent = this.dependents[i];
            if (dependent.propertyName == propertyName) {
                dependent.constraint.invalidate();
            }
        }
    }

    /* PROPERTIES */
    get boundingBox() {
        return this.getBoundingBox();
    }

    get x() {
        return this._x.valueOf() + (this.group != null ? this.group.x.valueOf() : 0) + (this.lineThickness != null ? this.lineThickness.valueOf()/2 : 0);
    }
    set x(newVal) {
        this._x=newVal;
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        this.propagate("x"); // this probably doesn't work if newVal is a constraint **fix**
    }

    get y() {
        return this._y.valueOf() + (this.group != null ? this.group.y.valueOf() : 0) + ((this.lineThickness != null) ? this.lineThickness.valueOf()/2 : 0);
    }
    set y(newVal) {
        this._y=newVal;    
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        this.propagate("y"); // this probably doesn't work if newVal is a constraint **fix**
   }


    /* ctx is a canvas returned from getContext */
    async draw(ctx) { }

    /* returns the bounding box as a dictionary with these fields:
     {x: , y: , width:, height: } 
     */
    getBoundingBox() { }

    /* moves the object to the specified coordinates */
    moveTo(x, y) {
        // this.originalX = x;
        // this.originalY = y;
        this.x = x;
        this.y = y;
    }

    /* sets the group of the object */
    setGroup(group) {
        this.group = group; // a real implementation may need to do more than just this
    }

    /* returns a boolean of whether this graphicalObject contains that point or not */
    contains(x, y) {
        var box = this.getBoundingBox();

        return x >= box.x && x <= (box.x + box.width) && y >= box.y && y <= (box.y + box.height);
    }

    recalcForGroup() {
        // don't this need as evaluated during valueOf();
        
        // if (this.group != null) {
        //     this.x = this.originalX + this.group.x.valueOf();
        //     this.y = this.originalY + this.group.y.valueOf();

        //     if (this.lineThickness != null) {
        //         this.x = this.x.valueOf() + this.lineThickness.valueOf() / 2;
        //         this.y = this.y.valueOf() + this.lineThickness.valueOf() / 2;
        //     }
        // }
    }
}