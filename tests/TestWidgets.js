class TestWidgets extends TestHarness {

    async runTest() {
        this.message("Setting up Widget Playground");
        let topGroup = new SimpleGroup(0, 0, 800, 600);
        this.topGraphics.addChild(topGroup);
        const ctx = this.topGraphics.ctx;

        let test = this;

		/* Note that this is just to give you an idea of how things should work. You will need
		 * to edit this file to match up with your actual design
		 */

        let objsOutline = new FilledRect(0, 0, 800, 600, "lightblue", 1);
        topGroup.addChild(objsOutline);

        let buttonPanel = new ButtonPanel(["b-one", "b-two", "b-three"], false, SELECT_SINGLE,
            function (button, value) { test.message(button.label + ", " + value) },
            16, 16, 800, 40);

        topGroup.addChild(buttonPanel);

        let singlePanel = new ButtonPanel(["single-one", "single-two", "single-three"], true, SELECT_SINGLE,
            function (button, value) { test.message(button.label + ", " + value) },
            16, 64, 800, 40);

        topGroup.addChild(singlePanel);

        let multiPanel = new ButtonPanel(["multiple-one", "multiple-two", "multiple-three"], true, SELECT_MULTIPLE,
            function (button, value) { test.message(button.label + ", " + value) },
            16, 112, 800, 40);

        topGroup.addChild(multiPanel);

        let checkBoxes = new CheckBoxPanel(["check-one", "check-two", "check-three"],
            function (button, value) { test.message(button.label + ", " + value) },
            16, 200, 800, 40);

        topGroup.addChild(checkBoxes);

        let radioPanel = new RadioPanel(["radio-one", "radio-two", "radio-three"],
            function (button, value) { test.message(button.label + ", " + value) },
            16, 250, 800, 800, VERTICAL);

        topGroup.addChild(radioPanel);

        let tb = new Text("", 10, 340, "16pt sans-serif", "black");
        tb.text = new Constraint(tb, "text", "", function (a) {
            return "Regular Buttons: " + a
        }, [
            new DependencyOn(buttonPanel, "value")
        ]);

        let tbs = new Text("", 10, 360, "16pt sans-serif", "black");
        tbs.text = new Constraint(tbs, "text", "", function (a) {
            return "Single Buttons: " + a
        }, [
            new DependencyOn(singlePanel, "value")
        ]);

        let tbm = new Text("", 10, 380, "16pt sans-serif", "black");
        tbm.text = new Constraint(tbs, "text", "", function (a) {
            return "Multi Buttons: " + Array.from(a)
        }, [
            new DependencyOn(multiPanel, "value")
        ]);

        let tcb = new Text("", 10, 400, "16pt sans-serif", "black");
        tcb.text = new Constraint(tcb, "text", "", function (a) {
            return "Checkboxes: " + Array.from(a)
        }, [
            new DependencyOn(checkBoxes, "value")
        ]);

        let trb = new Text("", 10, 420, "16pt sans-serif", "black");
        trb.text = new Constraint(trb, "text", "", function (a) {
            return "Radio Buttons: " + a
        }, [
            new DependencyOn(radioPanel, "value")
        ]);

        topGroup.addChild(tb);
        topGroup.addChild(tbs);
        topGroup.addChild(tbm);
        topGroup.addChild(tcb);
        topGroup.addChild(trb);


        this.message("0. Objects now ready.");
        await this.topGraphics.redraw();
        await this.waitForUser();
    }
}
