/* 
Each of these classes needs to be put into its own class in your code. 
There are all collected together here just for brevity. You should modify
the body of all the methods to do the right things.
*/

class GraphicalObject {

    /* creates an empty object at a location */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.group = null;
    }

    /* ctx is a canvas returned from getContext */
    draw(ctx) { }

    /* returns the bounding box as a dictionary with these fields:
     {x: , y: , width:, height: } 
     */
    getBoundingBox() { }

    /* moves the object to the specified coordinates */
    moveTo(x, y) {
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
            this.x = this.x + this.group.x;
            this.y = this.y + this.group.y;
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

    draw(ctx) {
        this.recalcForGroup();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineThickness;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getBoundingBox() {
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

    draw(ctx) {
        this.recalcForGroup();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getBoundingBox() {
        return {
            x: this.x - (this.lineThickness / 2),
            y: this.y - (this.lineThickness / 2),
            width: this.width + (this.lineThickness),
            height: this.height + (this.lineThickness)
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
    }

    draw(ctx) {
        this.recalcForGroup();

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineWidth = this.lineThickness;

        // set line color
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    getBoundingBox() {
        return {
            x: min(this.x1, this.x2) - (this.lineThickness / 2),
            y: min(this.y1, this.y2) - (this.lineThickness / 2),
            width: max(this.x1, this.x2) - min(this.x1, this.x2) + (this.lineThickness),
            height: max(this.y1, this.y2) - min(this.y1, this.y2) + (this.lineThickness)
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

    draw(ctx) {
        this.recalcForGroup();

        var img = new Image;
        img.src = this.imageFile;
        var icon = this;
        img.onload = function() {
            if (icon.width == undefined || icon.height == undefined) {
                icon.width = this.width;
                icon.height = this.height;
            }
            ctx.drawImage(this, icon.x, icon.y, icon.width, icon.height);
        }
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
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

    draw(ctx) {
        this.recalcForGroup();

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    getBoundingBox() {
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

    draw(ctx) {
        this.children.forEach(child => {
            child.draw(ctx);
        });
    }

    /* 
      adds the child to the group. 
      child must be a GraphicalObject.
      Returns false and does nothing if child is in a different group, returns true if successful
    */
    addChild(child) {
        if (child instanceof GraphicalObject && child.group == null) {
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
        if (child.prototype instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                child.group = null;
                this.children.splice(index,1);
                return true;
            }
        } else {
            return false;
        }
    }

    /* brings the child to the front. Returns false if child was not in the group, otherwise returns true
    */
    bringChildToFront(child) { 

        if (child.prototype instanceof GraphicalObject && child.group == this) {
            const index = this.children.indexOf(child);
            if (index == -1) {
                return false;
            } else {
                this.children.splice(index,1);
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

        let min_x = 0;
        let max_x = 0;
        let min_y = 0;
        let max_y = 0;

        this.children.forEach(child => {
            if ( child.getBoundingBox().x < min_x ) min_x = child.getBoundingBox().x;
            if ( child.getBoundingBox().y < min_y ) min_y = child.getBoundingBox().y;
            if ( child.getBoundingBox().x + getBoundingBox().width > max_x ) max_x = child.getBoundingBox().x + getBoundingBox().width;
            if ( child.getBoundingBox().y + getBoundingBox().height > max_y ) max_y = child.getBoundingBox().y + getBoundingBox().height;
        });

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

    addChild(child) {
        if (child instanceof GraphicalObject && child.group == null) {
            child.setGroup(this);

            if (this.children.length != 0) {
                if (this.layout == HORIZONTAL) {
                    child.moveTo(this.lastX + this.offset, 0);
                    this.lastX = child.getBoundingBox().x + child.getBoundingBox().width;
                } else {
                    child.moveTo(0, this.lastY + this.offset);
                    this.lastY = child.getBoundingBox().y + child.getBoundingBox().height;
                }
            } else {
                child.moveTo(0,0);
                this.lastX = child.getBoundingBox().x + child.getBoundingBox().width;
                this.lastY = child.getBoundingBox().y + child.getBoundingBox().height;
            }

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
                this.children.splice(index,1);

                this.lastX = 0;
                this.lastY = 0;
                var first = true;

                this.children.forEach(c => {
                    if (!first) {
                        if (this.layout == HORIZONTAL) {
                            c.moveTo(this.lastX + this.offset, 0);
                            this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                        } else {
                            c.moveTo(0, this.lastY + this.offset);
                            this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                        }
                    } else {
                        c.moveTo(0,0);
                        this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                        this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                        first = false;
                    }
                });

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
                this.children.splice(index,1);
                this.children.push(child);

                this.lastX = 0;
                this.lastY = 0;
                var first = true;

                // probably the wrong implementation here
                this.children.forEach(c => {
                    if (!first) {
                        if (this.layout == HORIZONTAL) {
                            c.moveTo(this.lastX + this.offset, 0);
                            this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                        } else {
                            c.moveTo(0, this.lastY + this.offset);
                            this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                        }
                    } else {
                        c.moveTo(0,0);
                        this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                        this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                        first = false;
                    }
                });

                return true;
            }
        } else {
            return false;
        }
    }

    draw(ctx) {
        this.lastX = 0;
        this.lastY = 0;
        var first = true;
        
        this.children.forEach(c => {
            if (!first) {
                if (this.layout == HORIZONTAL) {
                    c.moveTo(this.lastX + this.offset, 0);
                    this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                } else {
                    c.moveTo(0, this.lastY + this.offset);
                    this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                }
            } else {
                c.moveTo(0,0);
                this.lastX = c.getBoundingBox().x + c.getBoundingBox().width;
                this.lastY = c.getBoundingBox().y + c.getBoundingBox().height;
                first = false;
            }
        });

        this.children.forEach(child => {
            child.draw(ctx);
        });
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
        if (child instanceof GraphicalObject && child.group == null) {
            child.setGroup(this);
            child.moveTo(child.x * this.scaleX, child.y * this.scaleY);

            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }

    
}