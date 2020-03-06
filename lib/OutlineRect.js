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
        this.propagate("width");
    }

    get height() {
        return this._height.valueOf();
    }
    set height (height) {
        this._height = height;
        this.propagate("height");
    }

    get color() {
        return this._color.valueOf();
    }
    set color (color) {
        this._color = color;
        this.propagate("color");
    }

    get lineThickness() {
        return this._lineThickness.valueOf();
    }
    set lineThickness (lineThickness) {
        this._lineThickness = lineThickness;
        this.propagate("lineThickness");
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

    getBoundingBox() {
        return {
            x: this.x - (this.lineThickness / 2),
            y: this.y - (this.lineThickness / 2),
            width: this.width + (this.lineThickness),
            height: this.height + (this.lineThickness)
        }
    }
}