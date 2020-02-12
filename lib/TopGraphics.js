/*
 * This files connects the graphics to the Canvas in the html file.
 * It can be used with the TestHarness or separately.
 */
class TopGraphics {
  constructor(canvas) {
    this.canvas = canvas;
    // first, fix blurry canvas problem by adjusting to display pixel ratio
    // see : https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    const scale = window.devicePixelRatio;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    this.ctx = canvas.getContext("2d");
    this.ctx.scale(scale, scale);

    // initialize with no children
    this.children = [];

  }

/*adds the top-level graphical obj. Should be some kind of group
  returns true if successful, or false if graphicObj is already in a group, 
  or there is already a top-level object 
  */
  addChild(graphicObj) {
    if (graphicObj.group) {
      console.error("Can't add an object to more than one group");
      return false;
    }
    graphicObj.group = null; //top level's group will be null
    if (this.children.length > 0) {
      console.error("Top level can only have one object")
      return false;
    }
    this.children.push(graphicObj);
    graphicObj.draw(this.ctx);
    return true;
  }

  redraw() {
    // First, erase the screen

    // Store the current transformation matrix
   this.ctx.save();
   // Use the identity matrix while clearing the canvas
   this.ctx.setTransform(1, 0, 0, 1, 0, 0);
   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Restore the transform
	  this.ctx.restore();

   //Second, redraw all the objects
    let child = this.children[0];
    if (child) {
      child.draw(this.ctx);
      return true;
      }
      else return false;
    }
  }