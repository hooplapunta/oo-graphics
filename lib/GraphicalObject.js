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
       return valOrConstraint.valueOf();
    }
}
function propagate(object) {
    //do something to tell each of the constraints in listOfUsers, that the value they depend on is now outofdate
    // in the real implementation, there probably needs to be a lot more parameters and state

    for (let i = 0; i < object.dependents.length; i++) {
        const obj = object.dependents[i];

        obj.evaluate();

        //obj.draw(obj.ctx);
    }
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
        return this._x.valueOf();
    }
    set x(newVal) {
        this._x=newVal;
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        propagate(this); // this probably doesn't work if newVal is a constraint **fix**
    }

    get y() {
        return this._y.valueOf();
    }
    set y(newVal) {
        this._y=newVal;    
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
            this.x = this.originalX + this.group.x.valueOf();
            this.y = this.originalY + this.group.y.valueOf();

            if (this.lineThickness != null) {
                this.x = this.x.valueOf() + this.lineThickness.valueOf() / 2;
                this.y = this.y.valueOf() + this.lineThickness.valueOf() / 2;
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
        this._width = width; 
        this._height = height; 
        this._color = color; 
        this._lineThickness = lineThickness;
    }

    get width() {
        return this._width.valueOf();
    }
    set width (width) {
        this._width = width;
        propagate(this);
    }

    get height() {
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        propagate(this);
    }

    get color() {
        return this._color.valueOf();
    }
    set color (color) {
        this._color = color;
        propagate(this);
    }

    get lineThickness() {
        return this._lineThickness.valueOf();
    }
    set lineThickness (lineThickness) {
        this._lineThickness = lineThickness;
        propagate(this);
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }
        this.recalcForGroup();

        ctx.strokeStyle = this.color.valueOf();
        ctx.lineWidth = this.lineThickness.valueOf();
        ctx.strokeRect(this.x.valueOf(), this.y.valueOf(), this.width.valueOf(), this.height.valueOf());
    }

    async getBoundingBox() {
        return {
            x: this.x.valueOf() - (this.lineThickness.valueOf() / 2),
            y: this.y.valueOf() - (this.lineThickness.valueOf() / 2),
            width: this.width.valueOf() + (this.lineThickness.valueOf()),
            height: this.height.valueOf() + (this.lineThickness.valueOf())
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
        this._width = width; 
        this._height = height; 
        this._color = color;
    }

    get width() {
        return this._width.valueOf();
    }
    set width (width) {
        this._width = width;
        propagate(this);
    }

    get height() {
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        propagate(this);
    }

    get color() {
        return this._color.valueOf();
    }
    set color (color) {
        this._color = color;
        propagate(this);
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.fillStyle = this.color.valueOf();
        ctx.fillRect(this.x.valueOf(), this.y.valueOf(), this.width.valueOf(), this.height.valueOf());
    }

    async getBoundingBox() {
        return {
            x: this.x.valueOf(),
            y: this.y.valueOf(),
            width: this.width.valueOf(),
            height: this.height.valueOf()
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
        this._x1 = x1; 
        this._y1 = y1; 
        this._x2 = x2; 
        this._y2 = y2; 
        this._color = color; 
        this._lineThickness = lineThickness;

        this.original_x1 = this.x1;
        this.original_y1 = this.y1;
        this.original_x2 = this.x2;
        this.original_y2 = this.y2;
    }

    get x1() {
        return this._x1.valueOf();
    }
    set x1 (x1) {
        this._x1 = x1;
        propagate(this);
    }

    get x2() {
        return this._x2.valueOf();
    }
    set x2 (x2) {
        this._x2 = x2;
        propagate(this);
    }

    get y1() {
        return this._y1.valueOf();
    }
    set y1 (y1) {
        this._y1 = y1;
        propagate(this);
    }

    get y2() {
        return this._y2.valueOf();
    }
    set y2 (y2) {
        this._y2 = y2;
        propagate(this);
    }

    get color() {
        return this._color.valueOf();
    }
    set color (color) {
        this._color = color;
        propagate(this);
    }

    get lineThickness() {
        return this._lineThickness.valueOf();
    }
    set lineThickness (lineThickness) {
        this._lineThickness = lineThickness;
        propagate(this);
    }

    async moveTo(x, y) {
        this.original_x1 = this.x1.valueOf();
        this.original_y1 = this.y1.valueOf();
        this.original_x2 = this.x2.valueOf();
        this.original_y2 = this.y2.valueOf();

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

            if (this.x1.valueOf() != this.original_x1 + this.group.x.valueOf()) {
                this.original_x1 = this.x1.valueOf();
            }
            if (this.y1.valueOf() != this.original_y1 + this.group.y.valueOf()) {
                this.original_y1 = this.y1.valueOf();
            }
            if (this.x2.valueOf() != this.original_x2 + this.group.x.valueOf()) {
                this.original_x2 = this.x2.valueOf();
            }
            if (this.y2.valueOf() != this.original_y2 + this.group.y.valueOf()) {
                this.original_y2 = this.y2.valueOf();
            }

            this.x1 = this.original_x1 + this.group.x.valueOf();
            this.y1 = this.original_y1 + this.group.y.valueOf();

            this.x2 = this.original_x2 + this.group.x.valueOf();
            this.y2 = this.original_y2 + this.group.y.valueOf();

        }
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.beginPath();
        ctx.moveTo(this.x1.valueOf(), this.y1.valueOf());
        ctx.lineTo(this.x2.valueOf(), this.y2.valueOf());
        ctx.lineWidth = this.lineThickness.valueOf();

        // set line color
        ctx.strokeStyle = this.color.valueOf();
        ctx.stroke();
    }

    async getBoundingBox() {
        return {
            x: Math.min(this.x1.valueOf(), this.x2.valueOf()) - (this.lineThickness.valueOf() / 2),
            y: Math.min(this.y1.valueOf(), this.y2.valueOf()) - (this.lineThickness.valueOf() / 2),
            width: Math.max(this.x1.valueOf(), this.x2.valueOf()) - Math.min(this.x1.valueOf(), this.x2.valueOf()) + (this.lineThickness.valueOf()),
            height: Math.max(this.y1.valueOf(), this.y2.valueOf()) - Math.min(this.y1.valueOf(), this.y2.valueOf()) + (this.lineThickness.valueOf())
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
        this._width = width; 
        this._height = height; 
        this._imageFile = imageFile;
    }

    get width() {
        if(this._width == undefined) {
            return undefined;
        }
        return this._width.valueOf();
    }
    set width (width) {
        this._width = width;
        propagate(this);
    }

    get height() {
        if(this._height == undefined) {
            return undefined;
        }
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        propagate(this);
    }

    get imageFile() {
        return this._imageFile.valueOf();
    }
    set imageFile (imageFile) {
        this._imageFile = imageFile;
        propagate(this);
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

        if (this.x.valueOf() != this.originalX + this.group.x.valueOf()) {
            this.originalX = this.x.valueOf();
        }
        if (this.y.valueOf() != this.originalY + this.group.y.valueOf()) {
            this.originalY = this.y.valueOf();
        }

        this.recalcForGroup();

        const img = await this.loadImage(this.imageFile);
        if (this.width == undefined || this.height == undefined) {
            this.width = img.width.valueOf();
            this.height = img.height.valueOf();
        }
        ctx.drawImage(img, this.x.valueOf(), this.y.valueOf(), this.width.valueOf(), this.height.valueOf());
    }

    async getBoundingBox() {
        const img = await this.loadImage(this.imageFile);
        return {
            x: this.x.valueOf(),
            y: this.y.valueOf(),
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
        this._text = text; 
        this._font = font; 
        this._color = color; 
        this.ctx = ctx;
    }

    // probably issues here with the baseline

    get text() {
        return this._text.valueOf();
    }
    set text (text) {
        this._text = text;
        propagate(this);
    }

    get font() {
        return this._font.valueOf();
    }
    set font (font) {
        this._font = font;
        propagate(this);
    }

    get color() {
        return this._color.valueOf();
    }
    set color (color) {
        this._color = color;
        propagate(this);
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.font = this.font.valueOf();
        ctx.fillStyle = this.color.valueOf();
        ctx.fillText(this.text.valueOf(), this.x.valueOf(), this.y.valueOf());
    }

    async getBoundingBox() {
        this.ctx.font = this.font.valueOf();

        return {
            x: this.x.valueOf(),
            y: this.y.valueOf(),
            width: this.ctx.measureText(this.text.valueOf()).width,
            height: this.ctx.measureText(this.text.valueOf()).actualBoundingBoxAscent + this.ctx.measureText(this.text.valueOf()).actualBoundingBoxDescent
        }
    }
}

/* main group superclass */
class Group extends GraphicalObject {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x, y);
        this._width = width; 
        this._height = height;
        this.children = [];
    }

    get width() {
        if(this._width == undefined) {
            return undefined;
        }
        return this._width.valueOf();
    }
    set width (width) {
        this._width = width;
        propagate(this);
    }

    get height() {
        if(this._height == undefined) {
            return undefined;
        }
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        propagate(this);
    }

    async draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x.valueOf(), this.y.valueOf(), this.width.valueOf(), this.height.valueOf());
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

        // issues here, will replace constraints
        this.x = min_x;
        this.y = min_y;
        this.width = max_x - min_x;
        this.height = max_y - min_y;
    }

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    parentToChild(x, y) {
        return [this.x.valueOf() - x, this.y.valueOf() - y];
    }

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    childToParent(x, y) {
        return [this.x.valueOf() + x, this.y.valueOf() + y];
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
            x: this.x.valueOf(),
            y: this.y.valueOf(),
            width: this.width.valueOf(),
            height: this.height.valueOf()
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
        this._layout = layout;
        this._offset = offset;

        this.lastX = 0;
        this.lastY = 0;
    }

    get layout() {
        return this._layout.valueOf();
    }
    set layout (layout) {
        this._layout = layout;
        propagate(this);
    }

    get offset() {
        return this._offset.valueOf();
    }
    set offset (offset) {
        this._offset = offset;
        propagate(this);
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
        ctx.rect(this.x.valueOf(), this.y.valueOf(), this.width.valueOf(), this.height.valueOf());
        ctx.clip();

        this.lastX = 0;
        this.lastY = 0;
        var first = true;

        for (let index = 0; index < this.children.length; index++) {
            const c = this.children[index];
            if (!first) {
                if (this.layout.valueOf() == HORIZONTAL) {
                    await c.moveTo(this.lastX + this.offset.valueOf(), 0);
                    const bb = await c.getBoundingBox();
                    this.lastX = bb.x + bb.width;
                } else {
                    await c.moveTo(0, this.lastY + this.offset.valueOf());
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
        this.scaleX = scaleX; 
        this.scaleY = scaleY;
    }

    // incomplete, probably should be doing something inside the objects to scale them
    addChild(child) {
        if (child instanceof GraphicalObject) {
            child.setGroup(this);
            child.moveTo(child.x.valueOf() * this.scaleX, child.y.valueOf() * this.scaleY);

            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }


}