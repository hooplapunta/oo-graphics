class TestTestHarness extends TestHarness {
  
  async runTest() {
    this.message(
      "This is an example of a dummy test. These messages show on screen to the user. \
      After a message, execute a command to test the test harness."
    );

    let g = new DummyGroup(); // pretend group to be at the top
    this.topGraphics.addChild(g); // topGraphics needs a group at the top level
    g.addChild(new DummyGraphicalObject()); // create one with default values
    this.topGraphics.redraw(); // need to call this each time to see the changes
    this.message("Just drew a dummy rectangle with default values.");
    await this.waitForUser();

    this.message("next a blue rectangle.");
    let r = new DummyGraphicalObject(180, 40, 40, 100, "blue", 2);
    g.addChild(r);
    this.topGraphics.redraw();
    await this.waitForUser();

    this.message("next move the blue rectangle.");
    r.x = 20; 
    r.y = 60;
    this.topGraphics.redraw();
    await this.waitForUser();

    this.message("now a pink one rectangle.");
    g.addChild(new DummyGraphicalObject(180, 5, 50, 100, "pink", 5));
    this.topGraphics.redraw();
    await this.waitForUser();

    this.message("now this color: #369802.");
    g.addChild(new DummyGraphicalObject(100, 70, 50, 50, "#369802", 1));
    this.topGraphics.redraw();
    await this.waitForUser();
    this.message("done.");
  }
}
