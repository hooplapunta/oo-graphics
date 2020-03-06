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