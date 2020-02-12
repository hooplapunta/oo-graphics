class TestSimpleGroup extends TestHarness {

  async runTest() {

	this.message("topGroup for TestSimpleGroup");
	let topGroup = new SimpleGroup (0,0,200, 200);
	
    this.topGraphics.addChild(topGroup); 

	let nObjects = 4;

	this.message("creating black frame");
	topGroup.addChild(new OutlineRect(9, 9, 182, 182, "black", 1));

	this.message("creating SimpleGroup inside black frame");
	let group = new SimpleGroup(10, 10, 180, 180);
	topGroup.addChild(group);
	
	this.message("creating 3 Rects in SimpleGroup");
	group.addChild(new FilledRect(1,1, 40, 20, "red"));
	group.addChild(new FilledRect(1,10, 20, 40, "green"));
	group.addChild(new FilledRect(10, 30, 50, 50, "yellow"));
		this.topGraphics.redraw();
		await this.waitForUser();
	
	this.message("moving group - rects should move too");
	group.moveTo(20, 30);
	this.topGraphics.redraw();
	await this.waitForUser();

	this.message("moving group back to where it was");
	group.moveTo(10, 10);
	this.topGraphics.redraw();
	await this.waitForUser();
	
	this.message("creating subgroup at 100,20 with rectangles in it");
	let subgroup = new SimpleGroup(100, 20, 50, 50);
	group.addChild(subgroup);
	subgroup.addChild(new FilledRect(0, 0, 10, 20, "blue"));
	subgroup.addChild(new FilledRect(5,10, 20, 20, "cyan"));
	subgroup.addChild(new FilledRect(15, 20, 50, 50, "orange"));
	this.topGraphics.redraw();
	await this.waitForUser();


	this.message("creating " + nObjects + " Rects at random places");
	let objects = [];
	let colors = ["black", "red", "blue" ];
	let i;
	for (i = 0; i < nObjects; ++i) {
		objects[i] = new OutlineRect(-20 + this.RandomInt(200), -20 + this.RandomInt(200),
		this.RandomInt(100), this.RandomInt(100), colors[this.RandomInt(3)], 1);
		group.addChild(objects[i]);
		}

	this.topGraphics.redraw();
	await this.waitForUser();

	this.message("moving rectangles 1000 times");
	this.message("just quit when ready");
	let gobj;
	for (i = 0; i < 1000; ++i) {
		gobj = objects[this.RandomInt(nObjects)];
		gobj.moveTo(-20 + this.RandomInt(200), -20 + this.RandomInt(200));
		group.bringChildToFront(gobj);
		this.topGraphics.redraw();
		await this.sleep(500);
	}

  }
}
