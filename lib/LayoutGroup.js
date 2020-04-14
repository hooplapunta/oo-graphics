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
        this.propagate("layout");
    }

    get offset() {
        return this._offset.valueOf();
    }
    set offset (offset) {
        this._offset = offset;
        this.propagate("offset");
    }

    addChild(child) {
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
                    c.moveTo(this.lastX + this.offset, 0);
                    const bb = c.getBoundingBox();
                    this.lastX = c._x + bb.width;
                } else {
                    c.moveTo(0, this.lastY + this.offset);
                    const bb = c.getBoundingBox();
                    this.lastY = c._y + bb.height;
                }
            } else {
                c.moveTo(0, 0);
                const bb = c.getBoundingBox();
                this.lastX = c._x + bb.width;
                this.lastY = c._y + bb.height;
                first = false;
            }

            await c.draw(ctx);
        }
        ctx.restore();
    }
}