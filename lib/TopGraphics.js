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

    this.runningBehvaior = null;

    // TopGraphics must handle JS events, translate them and pass them down
    canvas.addEventListener('mousedown', e => this.handleEvent(e));
    canvas.addEventListener('mousemove', e => this.handleEvent(e));
    canvas.addEventListener('mouseup', e => this.handleEvent(e));
    canvas.addEventListener('click', e => this.handleEvent(e));
    canvas.addEventListener('dblclick', e => this.handleEvent(e));

    canvas.addEventListener('wheel', e => this.handleEvent(e));

    canvas.addEventListener('keydown', e => this.handleEvent(e));
    canvas.addEventListener('keyup', e => this.handleEvent(e));
    canvas.addEventListener('keypress', e => this.handleEvent(e));
  }

  handleEvent(event) {
    var bEvent = new BehaviorEvent(event);
    bEvent.x = bEvent.x - this.canvas.getBoundingClientRect().left;
    bEvent.y = bEvent.y - this.canvas.getBoundingClientRect().top;

    if (this.runningBehvaior != null) {
      // there is already something running
      if (this.runningBehvaior.running(bEvent)) {
        // running has called stop or abort
        this.runningBehvaior = null;
      }
      this.redraw();
      return;
    }

    // there is nothing to run, see if this starts something
    for (let i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        if (child instanceof Group) {
            child.getAllBehaviors().forEach(b => {
              if (b.start(bEvent)) {
                // this behavior has started
                this.runningBehvaior = b;
                this.redraw();
                return;
              }
            });
        }
    }
  }

  /*adds the top-level graphical obj. Should be some kind of group
    returns true if successful, or false if graphicObj is already in a group, 
    or there is already a top-level object 
    */
  async addChild(graphicObj) {
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
    await graphicObj.draw(this.ctx);
    return true;
  }

  async redraw() {
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
      await child.draw(this.ctx);
      return true;
    }
    else return false;
  }
}