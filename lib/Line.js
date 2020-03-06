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