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
            child.moveTo(child.x * this.scaleX, child.y * this.scaleY);

            this.children.push(child);
            return true;
        } else {
            return false;
        }
    }


}