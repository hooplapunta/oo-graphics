/* main group superclass */
class Group extends GraphicalObject {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x, y);
        this._width = width; 
        this._height = height;
        this.children = [];

        this.behaviors = [];
    }

    addBehvaior(behavior) {
        this.behaviors.push(behavior)
    }

    removeBehvaior(behavior) {
        const index = this.behaviors.indexOf(behavior);
        if (index > -1) {
            this.behaviors.splice(index, 1);
        }
    }

    get width() {
        if(this._width == undefined) {
            return undefined;
        }
        return this._width.valueOf();
    }
    set width (width) {
        this._width = width;
        this.propagate("width");
    }

    get height() {
        if(this._height == undefined) {
            return undefined;
        }
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        this.propagate("height");
    }

    async draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();

        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            await child.draw(ctx);
        }

        ctx.restore();
    }

    /* 
      adds the child to the group. 
      child must be a GraphicalObject.
      Returns false and does nothing if child is in a different group, returns true if successful
    */
    addChild(child) {
        if (child instanceof GraphicalObject) {
            child.setGroup(this);
            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }

    /* 
      removes the child from the group. 
      child must be a GraphicalObject.
      Returns false and does nothing if child was not in the group.
      returns true if successfully removed.
    */
    removeChild(child) {
        if (child instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                child.group = null;
                this.children.splice(index, 1);
                return true;
            }
        } else {
            return false;
        }
    }

    /* brings the child to the front. Returns false if child was not in the group, otherwise returns true
    */
    bringChildToFront(child) {

        if (child instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                this.children.splice(index, 1);
                this.children.push(child);
                return true;
            }
        } else {
            return false;
        }

    }

    /* calculates the width and height to just fit all the children, and sets the group to that size.
        returns new [width, height] as an array.
    */
    resizeToChildren() {

        const child = this.children[0];
        const bb = child.getBoundingBox();
        
        let min_x = bb.x;
        let max_x = bb.y;
        let min_y = bb.x + bb.width;
        let max_y = bb.y + bb.height;

        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            const bb = child.getBoundingBox();
            if (bb.x < min_x) min_x = bb.x;
            if (bb.y < min_y) min_y = bb.y;
            if (bb.x + bb.width > max_x) max_x = bb.x + bb.width;
            if (bb.y + bb.height > max_y) max_y = bb.y + bb.height;
        }

        // issues here, will replace constraints
        this.x = min_x;
        this.y = min_y;
        this.width = max_x - min_x;
        this.height = max_y - min_y;
    }

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    parentToChild(x, y) {
        return [this.x - x, this.y - y];
    }

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    childToParent(x, y) {
        return [this.x + x, this.y + y];
    }

    childAtPoint(x, y) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var bb = child.getBoundingBox();
            if (x >= bb.x && x <= bb.x + bb.width
                && y >= bb.y && y <= bb.y + bb.height) {
                    return child;
            }
        }

        return null;
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    getAllBehaviors() {
        var allBehaviors = [];
        allBehaviors = allBehaviors.concat(this.behaviors);
    
        for (let i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            if (child instanceof Group) {
                allBehaviors = allBehaviors.concat(child.getAllBehaviors());
            }
        }

        return allBehaviors;
    }
}