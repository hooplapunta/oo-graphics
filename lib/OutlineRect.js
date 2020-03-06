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