class TestHomework3 extends TestHarness {

	async runTest() {
		this.message("topGroup for TestHomework3");
		let topGroup = new SimpleGroup(0, 0, 300, 400);

		this.topGraphics.addChild(topGroup);

		this.message("1. creating blue and red rects");
		let blueRect = new OutlineRect(10, 10, 50, 50, "blue", 5);
		let redRect = new OutlineRect(100, 0, 50, 80, "red", 1);
		let group = new SimpleGroup(0, 0, 300, 400);

		topGroup.addChild(group);
		group.addChild(blueRect);
		group.addChild(redRect);
		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("2. moving blue to 30,30, red shouldn't move");
		blueRect.moveTo(30, 30);
		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("3. adding constraint to red rect to be at right of blue");
		this.message("     red should move to be at 80,30");

		/*
		  redRect.setX( **New constraint = blueRect's right side ** );
		  redRect.setY( **New constraint = blueRect's Y ** );
		*/
		redRect.x = new Constraint(redRect, "x", 0, function () {
			let bb = blueRect.getBoundingBox();
			return bb.x + bb.width;
		}, [
			new DependencyOn(blueRect, "x"),
			new DependencyOn(blueRect, "width")
		]);

		redRect.y = new Constraint(redRect, "y", 0, function () {
			return blueRect.y;
		}, [
			new DependencyOn(blueRect, "y")
		]);

		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("4. Move Blue, red should move automatically");
		blueRect.moveTo(0, 0);
		await this.topGraphics.redraw();
		await this.waitForUser();


		this.message("5a. Add another constraint to the chain with green rect on the bottom right corner of red rect");
		let greenRect = new OutlineRect(100, 100, 90, 65, "green", 1);
		group.addChild(greenRect);
		await this.topGraphics.redraw();

		greenRect.x = new Constraint(greenRect, "x", 0, function () {
			let bb = redRect.getBoundingBox();
			return bb.x + bb.width;
		}, [
			new DependencyOn(redRect, "x"),
			new DependencyOn(redRect, "width")
		]);

		greenRect.y = new Constraint(greenRect, "y", 0, function () {
			let bb = redRect.getBoundingBox();
			return bb.y + bb.height;
		}, [
			new DependencyOn(redRect, "y"),
			new DependencyOn(redRect, "height")
		]);

		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("5. Move Blue, whole chain should move");
		blueRect.moveTo(20, 30);
		await this.topGraphics.redraw();
		await this.waitForUser();


		group.removeChild(redRect);
		group.removeChild(blueRect);
		group.removeChild(greenRect);

		this.message("Y. A complex example of dependencies, including strings. Last object in the chain depends on the previous 2 objects.");
		let count3 = 0;
		let color = "#000000";
		let shapes = [];

		let first = new FilledRect(10, 10, 50, 150, color);
		shapes.push(first);
		group.addChild(first);
		count3++;
		await this.topGraphics.redraw();

		let second = new OutlineRect(0, 0, 60, 160, color, 4);
		second.x = new Constraint(second, "x", 0, function () {
			return first.x * 2;
		}, [
			new DependencyOn(first, "x")
		]);
		second.y = new Constraint(second, "y", 0, function () {
			return first.y * 2;
		}, [
			new DependencyOn(first, "y")
		]);
		second.color = new Constraint(second, "color", 0, function () {
			return first.color.slice(0, 1) + (count3 + 6) + first.color.slice(2);
			;
		}, [
			new DependencyOn(first, "color")
		]);

		shapes.push(second);
		group.addChild(second);
		count3++;
		await this.topGraphics.redraw();

		let third = new Icon("tests/jslogoSmall.png", 20, 20);
		third.x = new Constraint(third, "x", 0, function () {
			return first.x + second.x;
		}, [
			new DependencyOn(first, "x"),
			new DependencyOn(second, "x")
		]);
		third.y = new Constraint(third, "y", 0, function () {
			return first.y + second.y;
		}, [
			new DependencyOn(first, "y"),
			new DependencyOn(second, "y")
		]);
		third.height = new Constraint(third, "height", 0, function () {
			return first.height + second.height;
		}, [
			new DependencyOn(first, "height"),
			new DependencyOn(second, "height")
		]);
		third.width = new Constraint(third, "width", 0, function () {
			return first.width + second.width;
		}, [
			new DependencyOn(first, "width"),
			new DependencyOn(second, "widths")
		]);

		shapes.push(third);
		group.addChild(third);
		count3++;
		await this.topGraphics.redraw();

		this.message("X. Attempt to make cycle by making blue.x dependent on red.x. NOTE: This will stop the testing application.");
		blueRect.x = new Constraint(blueRect, "x", 0, function () {
			let bb = redRect.getBoundingBox();
			return bb.x + bb.width;
		}, [
			new DependencyOn(redRect, "x"),
			new DependencyOn(redRect, "width")
		]);
		await this.topGraphics.redraw();
		await this.waitForUser();

		// *** Add in some more constraints and tests here to show the range of 
		// *** what you can express and the appropriate syntax

		this.message("DONE. close the window to stop");

	}
}
