/* 
Each of these classes needs to be put into its own class in your code. 
There are all collected together here just for brevity. You should modify
the body of all the methods to do the right things.
*/
class GraphicalObject {

    /* creates an empty object at a location */
    constructor(x = 0, y = 0) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;

        this.group = null;

        // for constraints
        this.dependents = [];
    }

    /* ctx is a canvas returned from getContext */
    async draw(ctx) { }

    /* returns the bounding box as a dictionary with these fields:
     {x: , y: , width:, height: } 
     */
    async getBoundingBox() { }

    /* moves the object to the specified coordinates */
    async moveTo(x, y) {
        this.originalX = x;
        this.originalY = y;
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
        if (this.group != null) {
            this.x = this.originalX + this.group.x;
            this.y = this.originalY + this.group.y;

            if (this.lineThickness != null) {
                this.x = this.x + this.lineThickness / 2;
                this.y = this.y + this.lineThickness / 2;
            }
        }
    }
}