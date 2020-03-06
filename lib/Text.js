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