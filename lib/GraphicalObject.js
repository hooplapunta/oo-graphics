/* 
Each of these classes needs to be put into its own class in your code. 
There are all collected together here just for brevity. You should modify
the body of all the methods to do the right things.
*/

function getNumberVal (valOrConstraint) {
    if (typeof (valOrConstraint) == "number")
       return valOrConstraint;
    else { // assume is a constraint
        // probably should add some error checking
       return valOrConstraint.evaluate();
    }
}
function propagate(object) {
    //do something to tell each of the constraints in listOfUsers, that the value they depend on is now outofdate
    // in the real implementation, there probably needs to be a lot more parameters and state
}


class GraphicalObject {

    /* creates an empty object at a location */
    constructor(x = 0, y = 0) {
        this.originalX = x;
        this.originalY = y;
        this._x = x;
        this._y = y;
        this.group = null;

        // for constraints
        this.dependents = [];
    }

    /* PROPERTIES */
    get x() {
        return getNumberVal (this._x);
    }
    set x(newVal) {
        if (typeof this._x == "number") {
            this._x=newVal;
            //if newVal is a constraint, then maybe need to get its new value?
        }
        else { 
            // x contains a constraint
            // may need to remove the constraint instead, if formula constraint system
            this._x=newVal;
        }
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        propagate(this); // this probably doesn't work if newVal is a constraint **fix**
    }

    get y() {
        return getNumberVal (this.iy);
    }
    
    set y(newVal) {
        if (typeof this.iy == "number") {
            this._y=newVal;
              //if newVal is a constraint, then maybe need to get its new value?
            }
        else { // y contains a constraint
            // may need to remove the constraint instead, if formula constraint system
            this._y.newVal;
        }
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        propagate(this); // this probably doesn't work if newVal is a constraint **fix**
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

/* class to create a rectangle outline
    x, y is the top, left of the rectangle
    x, y, width, height, lineThickness are all numbers
    color = color of the outline
    the rectangle should grow inwards if lineThickness changes, so the width and height don't change
    */
class OutlineRect extends GraphicalObject {
    constructor(x = 0, y = 0, width = 20, height = 20, color = "black", lineThickness = 1) {
        super(x, y);
        this.width = width; this.height = height; this.color = color; this.lineThickness = lineThickness;
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }
        this.recalcForGroup();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineThickness;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    async getBoundingBox() {
        return {
            x: this.x - (this.lineThickness / 2),
            y: this.y - (this.lineThickness / 2),
            width: this.width + (this.lineThickness),
            height: this.height + (this.lineThickness)
        }
    }
}


/* class to create a filled rectangle
    x, y is the top, left of the rectangle
    x, y, width, height are all numbers
    color = color of the fill
*/
class FilledRect extends GraphicalObject {
    constructor(x = 0, y = 0, width = 20, height = 20, color = "black") {
        super(x, y);
        this.width = width; this.height = height; this.color = color;
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    async getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
}

/* class to create a straight line object
    color = color of the line, 
    x1, y1, x2, y2, lineThickness are all numbers
    do not access x,y,width, height of a line since need to be calculated, use getBoundingBox instead.
*/
class Line extends GraphicalObject {
    constructor(x1 = 0, y1 = 0, x2 = 20, y2 = 20, color = "black", lineThickness = 1) {
        super(0, 0); //have to calculate the correct x,y for the call to super
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; this.color = color; this.lineThickness = lineThickness;
        this.original_x1 = this.x1;
        this.original_y1 = this.y1;
        this.original_x2 = this.x2;
        this.original_y2 = this.y2;
    }

    async moveTo(x, y) {
        this.original_x1 = this.x1;
        this.original_y1 = this.y1;
        this.original_x2 = this.x2;
        this.original_y2 = this.y2;

        const bb = await this.getBoundingBox();
        const x_diff = x - bb.x;
        const y_diff = y - bb.y;

        this.x1 = this.original_x1 + x_diff;
        this.y1 = this.original_y1 + y_diff;

        this.x2 = this.original_x2 + x_diff;
        this.y2 = this.original_y2 + y_diff;
    }

    recalcForGroup() {
        if (this.group != null) {

            // const bb = this.getBoundingBox();
            // const x_diff = this.getBoundingBox().x - this.group.x;
            // const y_diff = this.getBoundingBox().y - this.group.y;

            if (this.x1 != this.original_x1 + this.group.x) {
                this.original_x1 = this.x1;
            }
            if (this.y1 != this.original_y1 + this.group.y) {
                this.original_y1 = this.y1;
            }
            if (this.x2 != this.original_x2 + this.group.x) {
                this.original_x2 = this.x2;
            }
            if (this.y2 != this.original_y2 + this.group.y) {
                this.original_y2 = this.y2;
            }

            this.x1 = this.original_x1 + this.group.x;
            this.y1 = this.original_y1 + this.group.y;

            this.x2 = this.original_x2 + this.group.x;
            this.y2 = this.original_y2 + this.group.y;



            // if (this.getBoundingBox().x + this.group.x - this.lineThickness/2 != this.getBoundingBox().x || this.getBoundingBox().y + this.group.y - this.lineThickness/2 != this.getBoundingBox().y) {


            //     this.moveTo(this.getBoundingBox().x + this.group.x - this.lineThickness/2, this.getBoundingBox().y + this.group.y - this.lineThickness/2);
            // }
        }
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineWidth = this.lineThickness;

        // set line color
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    async getBoundingBox() {
        return {
            x: Math.min(this.x1, this.x2) - (this.lineThickness / 2),
            y: Math.min(this.y1, this.y2) - (this.lineThickness / 2),
            width: Math.max(this.x1, this.x2) - Math.min(this.x1, this.x2) + (this.lineThickness),
            height: Math.max(this.y1, this.y2) - Math.min(this.y1, this.y2) + (this.lineThickness)
        }
    }
}

/* class to create an image
    imageFile is a string of the name of the file, can be local file or URL
    x, y are position of the image
    if the height and width are undefined, then they are gotten from the image's width and height
*/
class Icon extends GraphicalObject {
    constructor(imageFile = undefined, x = 0, y = 0, width = undefined, height = undefined) {
        super(x, y);
        this.width = width; this.height = height; this.imageFile = imageFile;
    }

    loadImage(url) {
        return new Promise(resolve => {
            const image = new Image();
            image.addEventListener("load", () => {
                resolve(image);
            });
            image.src = url;
        });
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        if (this.x != this.originalX + this.group.x) {
            this.originalX = this.x;
        }
        if (this.y != this.originalY + this.group.y) {
            this.originalY = this.y;
        }

        this.recalcForGroup();

        const img = await this.loadImage(this.imageFile);
        if (this.width == undefined || this.height == undefined) {
            this.width = img.width;
            this.height = img.height;
        }
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }

    async getBoundingBox() {
        const img = await this.loadImage(this.imageFile);
        return {
            x: this.x,
            y: this.y,
            width: img.width,
            height: img.height
        }
    }
}

/*  class to create text or strings on the screen
    text is a string to be displayed
    x, y are the coordinates of the baseline of the string
    font is string that defines an appropriate font
    color = color of the text
    do not access width, height of a Text since needs to be calculated, use getBoundingBox instead.
    ctx is the context of the Canvas object. This is needed to calculate the size. It is needed in constructor
       since it must work to ask for the size before the object is drawn.
*/
class Text extends GraphicalObject {
    constructor(text = "test", x = 0, y = 0, font = "", color = "black", ctx) {
        super(x, y);
        this.text = text; this.font = font; this.color = color; this.ctx = ctx;
    }

    // probably issues here with the baseline

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    async getBoundingBox() {
        this.ctx.font = this.font;

        return {
            x: this.x,
            y: this.y,
            width: this.ctx.measureText(this.text).width,
            height: this.ctx.measureText(this.text).actualBoundingBoxAscent + this.ctx.measureText(this.text).actualBoundingBoxDescent
        }
    }
}

/* main group superclass */
class Group extends GraphicalObject {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x, y);
        this.width = width; this.height = height;
        this.children = [];
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
    async resizeToChildren() {

        const child = this.children[0];
        const bb = await child.getBoundingBox();
        
        let min_x = bb.x;
        let max_x = bb.y;
        let min_y = bb.x + bb.width;
        let max_y = bb.y + bb.height;

        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            const bb = await child.getBoundingBox();
            if (bb.x < min_x) min_x = bb.x;
            if (bb.y < min_y) min_y = bb.y;
            if (bb.x + bb.width > max_x) max_x = bb.x + bb.width;
            if (bb.y + bb.height > max_y) max_y = bb.y + bb.height;
        }

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


    async getBoundingBox() {

        // const x1 = [];
        // const y1 = [];

        // const x2 = [];
        // const y2 = [];

        // for (let index = 0; index < this.children.length; index++) {
        //     const child = this.children[index];
        //     const bb = await child.getBoundingBox();

        //     x1.push(bb.x);
        //     y1.push(bb.y);

        //     x2.push(bb.x + bb.width);
        //     y2.push(bb.y + bb.height);
        // }

        // return {
        //     x: Math.min(...x1),
        //     y: Math.min(...y1),
        //     width: Math.max(...x2) - Math.min(...x1),
        //     height: Math.max(...y2) - Math.min(...y1)
        // }

        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
}

/* implements the standard Group interface, as defined above.
*/
class SimpleGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x, y, width, height);
    }
}

/* LayoutGroup sets the x,y of each child so they are layed out in a row or column,
depending on the layout parameter. 
There is offset distance between each child object, which can be negative.
*/
const HORIZONTAL = 0;
const VERTICAL = 1;

class LayoutGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100, layout = HORIZONTAL, offset = 10) {
        super(x, y, width, height);
        this.layout = layout;

        this.offset = offset;
        this.lastX = 0;
        this.lastY = 0;
    }

    async addChild(child) {
        if (child instanceof GraphicalObject) {
            child.setGroup(this);

            // if (this.children.length != 0) {
            //     if (this.layout == HORIZONTAL) {
            //         await child.moveTo(this.lastX + this.offset, 0);
            //         const bb = await child.getBoundingBox();
            //         this.lastX = bb.x + bb.width;
            //     } else {
            //         await child.moveTo(0, this.lastY + this.offset);
            //         const bb = await child.getBoundingBox();
            //         this.lastY = bb.y + bb.height;
            //     }
            // } else {
            //     await child.moveTo(0, 0);
            //     const bb = await child.getBoundingBox();
            //     this.lastX = bb.x + bb.width;
            //     this.lastY = bb.y + bb.height;
            // }

            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }

    removeChild(child) {
        if (child instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                child.group = null;
                this.children.splice(index, 1);

                // this.lastX = 0;
                // this.lastY = 0;
                // var first = true;

                // this.children.forEach(c => {
                //     if (!first) {
                //         if (this.layout == HORIZONTAL) {
                //             c.moveTo(this.lastX + this.offset, 0);
                //             this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                //         } else {
                //             c.moveTo(0, this.lastY + this.offset);
                //             this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                //         }
                //     } else {
                //         c.moveTo(0, 0);
                //         this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                //         this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                //         first = false;
                //     }
                // });

                return true;
            }
        } else {
            return false;
        }
    }

    bringChildToFront(child) {
        if (child instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                this.children.splice(index, 1);
                this.children.push(child);

                // this.lastX = 0;
                // this.lastY = 0;
                // var first = true;

                // // probably the wrong implementation here
                // this.children.forEach(c => {
                //     if (!first) {
                //         if (this.layout == HORIZONTAL) {
                //             c.moveTo(this.lastX + this.offset, 0);
                //             this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                //         } else {
                //             c.moveTo(0, this.lastY + this.offset);
                //             this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                //         }
                //     } else {
                //         c.moveTo(0, 0);
                //         this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                //         this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                //         first = false;
                //     }
                // });

                return true;
            }
        } else {
            return false;
        }
    }

    async draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();

        this.lastX = 0;
        this.lastY = 0;
        var first = true;

        for (let index = 0; index < this.children.length; index++) {
            const c = this.children[index];
            if (!first) {
                if (this.layout == HORIZONTAL) {
                    await c.moveTo(this.lastX + this.offset, 0);
                    const bb = await c.getBoundingBox();
                    this.lastX = bb.x + bb.width;
                } else {
                    await c.moveTo(0, this.lastY + this.offset);
                    const bb = await c.getBoundingBox();
                    this.lastY = bb.y + bb.height;
                }
            } else {
                await c.moveTo(0, 0);
                const bb = await c.getBoundingBox();
                this.lastX = bb.x + bb.width;
                this.lastY = bb.y + bb.height;
                first = false;
            }

            await c.draw(ctx);
        }
        ctx.restore();
    }
}

/* ScaledGroup does not change the parameters of its children, but they are all displayed
smaller or bigger depending on the scaleX and scaleY parameters. 
If >1 then bigger, if <1.0 then smaller.
*/
class ScaledGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100, scaleX = 2.0, scaleY = 2.0) {
        super(x, y, width, height);
        this.scaleX = scaleX; this.scaleY = scaleY;
    }

    // incomplete, probably should be doing something inside the objects to scale them
    addChild(child) {
        if (child instanceof GraphicalObject) {
            child.setGroup(this);
            child.moveTo(child.x * this.scaleX, child.y * this.scaleY);

            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }


}