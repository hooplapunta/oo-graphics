
// simple test classes based on OutlineRect and Group.
// this is just for testing the TestHarness - do not use in your implementation;
// all real subclasses of GraphicalObject will need to do a lot more
class DummyGraphicalObject extends GraphicalObject {
  constructor(x = 0, y = 0, width = 20, height = 20, color = "black", lineThickness = 1) {
      //color = color of the outline, x, y, width, height, lineThickness are all numbers
      //x, y is the top, left of the rectangle
      super(x,y);
      this.width = width;
      this.height = height;
      this.color = color;
      this.lineThickness = lineThickness;
    }
  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineThickness;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

// a real implementation of group needs to implement all the methods, and do more checking
class DummyGroup extends Group {
  addChild(child) {
    this.children.push(child);
  }
  draw(ctx) {
    let child = null;
    for (child of this.children) {
      child.draw(ctx);
    }
  }


}
