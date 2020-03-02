class TestHomework3 extends TestHarness {

	async runTest() {
		this.message("topGroup for TestHomework3");
		let topGroup = new SimpleGroup (0,0,300, 400);
		
		this.topGraphics.addChild(topGroup); 
	
        this.message ("1. creating blue and red rects");
		let blueRect = new OutlineRect(10, 10, 50, 50, "blue", 5);
	 	let redRect = new OutlineRect (100, 0, 50, 80, "red", 1);
        let group = new SimpleGroup (0, 0, 300, 400);

		topGroup.addChild (group);
        group.addChild (blueRect);
        group.addChild (redRect);
		this.topGraphics.redraw();
		await this.waitForUser();

		this.message ("2. moving blue to 30,30, red shouldn't move");
		blueRect.moveTo(30,30);
		this.topGraphics.redraw();
		await this.waitForUser();

		this.message ("3. adding constraint to red rect to be at right of blue");
		this.message ("     red should move to be at 80,30");

	/*
	  redRect.setX( **New constraint = blueRect's right side ** );
	  redRect.setY( **New constraint = blueRect's Y ** );
	*/
		this.topGraphics.redraw();
		await this.waitForUser();

		this.message("4. Move Blue, red should move automatically");
		blueRect.moveTo(0,0);
		this.topGraphics.redraw();
		await this.waitForUser();

	 // *** Add in some more constraints and tests here to show the range of 
	 // *** what you can express and the appropriate syntax

		 this.message ("DONE. close the window to stop");

    }
}
