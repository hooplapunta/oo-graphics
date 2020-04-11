/*  class to create text or strings on the screen
    text is a string to be displayed
    x, y are the coordinates of the baseline of the string
    font is string that defines an appropriate font
    color = color of the text
    do not access width, height of a Text since needs to be calculated, use getBoundingBox instead.
*/
class Text extends GraphicalObject {
    constructor(text = "test", x = 0, y = 0, font = "", color = "black") {
        super(x, y);
        this._text = text;
        this._font = font;
        this._color = color;

        this.tempCanvas = document.createElement("canvas");
        this.tempCtx = this.tempCanvas.getContext("2d");
    }

    // override to get text in the right place
    get y() {
        this.tempCtx.font = this.font;

        return this._y.valueOf() 
            + this.tempCtx.measureText(this.text).actualBoundingBoxAscent
            + (this.group != null ? this.group.y.valueOf() : 0) + ((this.lineThickness != null) ? this.lineThickness.valueOf() / 2 : 0);
    }
    set y(newVal) {
        this._y = newVal;
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        this.propagate("y"); // this probably doesn't work if newVal is a constraint **fix**
    }

    get text() {
        return this._text.valueOf();
    }
    set text(text) {
        this._text = text;
        this.propagate("text");
    }

    get font() {
        return this._font.valueOf();
    }
    set font(font) {
        this._font = font;
        this.propagate("font");
    }

    get color() {
        return this._color.valueOf();
    }
    set color(color) {
        this._color = color;
        this.propagate("color");
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        this.recalcForGroup();

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    get height() {
        this.tempCtx.font = this.font;
        return this.tempCtx.measureText(this.text).actualBoundingBoxAscent
        + this.tempCtx.measureText(this.text).actualBoundingBoxDescent;
    }

    get width() {
        this.tempCtx.font = this.font;
        return this.tempCtx.measureText(this.text).width;
    }

    getBoundingBox() {
        this.tempCtx.font = this.font;

        return {
            x: this.x,
            y: this.y - this.tempCtx.measureText(this.text).actualBoundingBoxAscent,
            width: this.tempCtx.measureText(this.text).width,
            height: this.tempCtx.measureText(this.text).actualBoundingBoxAscent
                + this.tempCtx.measureText(this.text).actualBoundingBoxDescent
        }
    }
}