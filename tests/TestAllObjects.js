class TestAllObjects extends TestHarness {
  
  async runTest() {
    this.message("topGroup");
	let topGroup = new SimpleGroup (0,0,300,400);
	this.topGraphics.addChild(topGroup);
	const ctx = this.topGraphics.ctx;

		this.message("OutlineRect");
		topGroup.addChild(new OutlineRect(10, 10, 50, 50, "black", 1));
		topGroup.addChild(new OutlineRect(70, 10, 80, 50, "red", 2));

		this.message("FilledRect");
		topGroup.addChild(new FilledRect(10, 70, 50, 50, "black"));
		topGroup.addChild(new FilledRect(70, 70, 80, 50, "red"));

		this.message("Line");
		topGroup.addChild(new Line(10, 130, 10, 180, "black", 1));
		topGroup.addChild(new Line(20, 130, 60, 130, "red", 3));
		topGroup.addChild(new Line(70, 130, 120, 180, "blue", 10));

		this.message("Icon");
		// added specific sizing because the text obscures everything else
		topGroup.addChild(new Icon("tests/jslogo.png", 10, 200, 91, 96));
		topGroup.addChild(new Icon("tests/dog.png", 80, 200, 19, 28));

		this.message("Text");
		topGroup.addChild(new Text("going", 10, 350, "", "black", ctx));
		topGroup.addChild(new Text("going", 70, 350, "SansSerif", "red", ctx));
		topGroup.addChild(new Text("gone", 140, 350, "Serif", "green", ctx));
    	topGroup.addChild(new Line(10, 350, 250, 350, "black", 1));
    
    	this.topGraphics.redraw();

		this.message("all done");
  }
}
