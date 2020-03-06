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

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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