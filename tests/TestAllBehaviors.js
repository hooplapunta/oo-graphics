class TestAllBehaviors extends TestHarness {

	async runTest() {
		this.message("topGroup");
		let topGroup = new SimpleGroup(0, 0, 400, 600);
		this.topGraphics.addChild(topGroup);
		const ctx = this.topGraphics.ctx;

		/* Note that this is just to give you an idea of how things should work. You will need
		 * to edit this file to match up with your actual design
		 */

		let objsOutline = new FilledRect(0, 0, 400, 600, "lightgrey", 1);
		topGroup.addChild(objsOutline);

		let objsGroup = new SimpleGroup(0, 0, 400, 600);
		topGroup.addChild(objsGroup);
		

		let r1 = new OutlineRect(20, 20, 50, 80, "black", 1);
		let r2 = new FilledRect(80, 20, 50, 50, "black");
		let l1 = new Line(30, 100, 50, 200, "black", 4);
		let t1 = new Text("going", 10, 350, "16pt sans-serif", "black");
		objsGroup.addChild(r1);
		objsGroup.addChild(r2);
		objsGroup.addChild(l1);
		//objsGroup.addChild(t1);

		r1.color = new Constraint(r1, "color", "pink", function (a, b) {
			if (a) {
				if (b) return "blue"; //both
				else return "green"; // just selected and not interimSelected
			} else if (b) {
				return "yellow" // just interimSelected and not selected
			} else {
				return "black";
			}
		}, [
			new DependencyOn(r1, "selected"),
			new DependencyOn(r1, "interimSelected")
		]);

		r2.color = new Constraint(r2, "color", "pink", function (a, b) {
			if (a) {
				if (b) return "blue"; //both
				else return "green"; // just selected and not interimSelected
			} else if (b) {
				return "yellow" // just interimSelected and not selected
			} else {
				return "black";
			}
		}, [
			new DependencyOn(r2, "selected"),
			new DependencyOn(r2, "interimSelected")
		]);

		t1.color = new Constraint(t1, "color", "pink", function (a, b) {
			if (a) {
				if (b) return "blue"; //both
				else return "green"; // just selected and not interimSelected
			} else if (b) {
				return "yellow" // just interimSelected and not selected
			} else {
				return "black";
			}
		}, [
			new DependencyOn(t1, "selected"),
			new DependencyOn(t1, "interimSelected")
		]);

		// debug the line
		let rx = new FilledRect(
			t1.getBoundingBox().x, 
			t1.getBoundingBox().y, 
			t1.getBoundingBox().width, 
			t1.getBoundingBox().height, "darkgrey");
		objsGroup.addChild(rx);
		objsGroup.addChild(t1);

		this.message("0. Objects now ready.");
		await this.topGraphics.redraw();
		await this.waitForUser();

		objsGroup.addBehvaior(new ChoiceBehavior(objsGroup,
			new BehaviorEvent("LEFT_MOUSE_DOWN")
		));

		objsGroup.addBehvaior(new NewBehavior(objsGroup,
			new BehaviorEvent("SHIFT_LEFT_MOUSE_DOWN"),
			new BehaviorEvent("SHIFT_LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			false,
			false,
			function(x,y,w,h) {
				objsGroup.addChild(new FilledRect(x, y, w, h, "black"));
			},
			new OutlineRect(0, 0, 0, 0, "red", 1)
		));

		objsGroup.addBehvaior(new NewBehavior(objsGroup,
			new BehaviorEvent("CONTROL_LEFT_MOUSE_DOWN"),
			new BehaviorEvent("CONTROL_LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			false,
			true,
			function(x1,y1,x2,y2) {
				objsGroup.addChild(new Line(x1, y1, x2, y2, "black", 2));
			},
			new Line(0, 0, 0, 0, "red", 1)
		));

		objsGroup.addBehvaior(new MoveBehavior(objsGroup,
			new BehaviorEvent("CONTROL_SHIFT_LEFT_MOUSE_DOWN"),
			new BehaviorEvent("CONTROL_SHIFT_LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			true
		));


		this.message("1. Behaviors Now Active.");
		this.message ("left to select; shift-left to create a rect; control-left of create a line; control-shift to move");
		
		await this.topGraphics.redraw();
		await this.waitForUser();


		/* Add constraint(s) to r1, r2, and t1 so that the color of each is:
		* 	if (this.selected) {
		* 		if (this.interimSelected) "blue"; //both
		* 		else "green"; // just selected and not interimSelected
		* 	}
		* 	else if (interimSelected) "yellow"; // just interimSelected and not selected
		* 	else "black";
		
			this.message ("left to select; shift-left to create a rect; control-left of create a line; control-shift to move");
		
		* Create a ChoiceBehavior in MULTIPLE mode that operates on the members of objsGroup with event "LEFT_MOUSE_DOWN"
		* Create a NewBehavior that creates FillRect in objsGroup with startEvent "SHIFT_LEFT_MOUSE_DOWN"
		* Create a NewBehavior that creates Lines in objsGroup with startEvent "CONTROL_LEFT_MOUSE_DOWN"
		* Create a MoveBehavior that moves an object in objsGroup with startEvent "CONTROL_SHIFT_LEFT_MOUSE_DOWN"

		* start the main event loop so the behaviors start running
		*/

		// TEST FOR STAMPS/ONECLICK NEW
		topGroup.removeChild(objsOutline);
		topGroup.removeChild(objsGroup);

		let stampOutline = new FilledRect(0, 0, 400, 600, "lightpink", 1);
		topGroup.addChild(stampOutline);

		let stampGroup = new SimpleGroup(0, 0, 400, 600);
		topGroup.addChild(stampGroup);

		stampGroup.addBehvaior(new NewBehavior(objsGroup,
			new BehaviorEvent("LEFT_MOUSE_DOWN"),
			new BehaviorEvent("LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			false,
			false,
			function(x,y,w,h) {
				stampGroup.addChild(new Icon("tests/jslogoSmall.png", x, y, 50, 50));
			}
		));

		this.message("2. New Stamping/OnePoint");
		this.message ("click in pink area to add a stamp to a single point");
		
		await this.topGraphics.redraw();
		await this.waitForUser();


		// TEST MULTI / NOT FIRSTONLY CHOICE
		topGroup.removeChild(stampOutline);
		topGroup.removeChild(stampGroup);

		let menuOutline = new FilledRect(0, 0, 400, 600, "lightblue", 1);
		topGroup.addChild(menuOutline);

		let menuGroup = new SimpleGroup(0, 0, 400, 600);
		topGroup.addChild(menuGroup);

		let m1 = new FilledRect(20, 20, 80, 20, "white");
		let m2 = new FilledRect(20, 40, 80, 20, "white");
		let m3 = new FilledRect(20, 60, 80, 20, "white");

		m1.color = new Constraint(m1, "color", "pink", this.menuColor, [
			new DependencyOn(m1, "selected"),
			new DependencyOn(m1, "interimSelected")
		]);

		m2.color = new Constraint(m2, "color", "pink", this.menuColor, [
			new DependencyOn(m2, "selected"),
			new DependencyOn(m2, "interimSelected")
		]);

		m3.color = new Constraint(m3, "color", "pink", this.menuColor, [
			new DependencyOn(m3, "selected"),
			new DependencyOn(m3, "interimSelected")
		]);

		menuGroup.addChild(m1);
		menuGroup.addChild(m2);
		menuGroup.addChild(m3);

		menuGroup.addBehvaior(new ChoiceBehavior(menuGroup,
			new BehaviorEvent("LEFT_MOUSE_DOWN"),
			new BehaviorEvent("LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			SELECT_MULTIPLE,
			false
		));

		this.message("3. multi select / drag-reselect ");
		this.message ("menu behavior with multiple selction option");

		await this.topGraphics.redraw();
		await this.waitForUser();


		this.message("close the window to stop");
	}

	menuColor(a, b) {
		if (a) {
			if (b) return "blue"; //both
			else return "green"; // just selected and not interimSelected
		} else if (b) {
			return "yellow" // just interimSelected and not selected
		} else {
			return "white";
		}
	}

}
