class TestEditor extends TestHarness {

    async runTest() {
        this.message("Setting up Draw My Box");
        let topGroup = new SimpleGroup(0, 0, 1024, 600);
        this.topGraphics.addChild(topGroup);

        let test = this;
        this.count = 0;
        this.selectedBox = 0;

        let objsOutline = new FilledRect(0, 0, 1024, 600, "antiquewhite", 1);
        topGroup.addChild(objsOutline);

        let title = new Text("Draw My Box!", 10, 10, "32pt sans-serif", "black");
        topGroup.addChild(title);

        let thickTitle = new Text("Thickness", 10, 60, "16pt sans-serif", "black");
        topGroup.addChild(thickTitle);

        let checkBoxes = new CheckBoxPanel(["Thick Outline", "Bold Font"],
            function (button, value) { test.message(button.label + ", " + value) },
            10, 100, 800, 40);

        topGroup.addChild(checkBoxes);

        let colorTitle = new Text("Color", 10, 160, "16pt sans-serif", "black");
        topGroup.addChild(colorTitle);

        let rBlack = new FilledRect(0, 0, 32, 32, "black");
        rBlack.value = "black";
        let rBlue = new FilledRect(0, 0, 32, 32, "blue");
        rBlue.value = "blue";
        let rGreen = new FilledRect(0, 0, 32, 32, "green");
        rGreen.value = "green";

        let colorPanel = new RadioPanel([rBlack, rBlue, rGreen],
            function (button, value) { test.message(button.label + ", " + value) },
            10, 200, 350, 40);

        topGroup.addChild(colorPanel);


        // drawing canvas
        let drawingCanvasBg = new FilledRect(350, 20, 640, 560, "white", 1);
        topGroup.addChild(drawingCanvasBg);

        let objsGroup = new SimpleGroup(350, 20, 640, 560);
        topGroup.addChild(objsGroup);

        objsGroup.addBehvaior(new MoveBehavior(objsGroup,
			new BehaviorEvent("CONTROL_LEFT_MOUSE_DOWN"),
			new BehaviorEvent("CONTROL_LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			true
		));

        objsGroup.addBehvaior(new ChoiceBehavior(objsGroup,
			new BehaviorEvent("SHIFT_LEFT_MOUSE_DOWN"),
			new BehaviorEvent("SHIFT_LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			SELECT_SINGLE,
			true
		));

        objsGroup.addBehvaior(new NewBehavior(objsGroup,
			new BehaviorEvent("LEFT_MOUSE_DOWN"),
			new BehaviorEvent("LEFT_MOUSE_UP"),
			new BehaviorEvent("ESC"),
			false,
			false,
			function(x,y,w,h) {
                var selectedColor = colorPanel.value;
                var selectedThickness = checkBoxes.value.has("Thick Outline") ? 5 : 2;

                let rect = new OutlineRect(x, y, w, h, selectedColor, selectedThickness);
                rect.color = new Constraint(rect, "color", selectedColor, function (a, b) {
                    if (a) {
                        if (b) return "red"; //both
                        else return "magenta"; // just selected and not interimSelected
                    } else if (b) {
                        return "red" // just interimSelected and not selected
                    } else {
                        return selectedColor;
                    }
                }, [
                    new DependencyOn(rect, "selected"),
                    new DependencyOn(rect, "interimSelected")
                ]);

                rect.onSelectionChange = function(object, value) {
                    if (value) {
                        test.selectedBox = object;
                    } else {
                        test.selectedBox = null;
                    }
                }

                objsGroup.addChild(rect);
                
                var selectedWeight = checkBoxes.value.has("Bold Font") ? "bold" : "";
                let label = new Text("Rect " + test.count, 0, 0, selectedWeight + " 12pt sans-serif", "black");
                label.x = new Constraint(label, "x", 0, function (a, b, c) {
                    return a + (b/2) - (c/2);
                }, [
                    new DependencyOn(rect, "x"),
                    new DependencyOn(rect, "width"),
                    new DependencyOn(label, "width")
                ]);
                label.y = new Constraint(label, "y", 0, function (a, b) {
                    return a + 10;
                }, [
                    new DependencyOn(rect, "y"),
                    new DependencyOn(rect, "height")
                ]);
                
                rect.attachedLabel = label;

                topGroup.addChild(label);   
                test.count++;
			},
			new OutlineRect(0, 0, 0, 0, "red", 1)
        ));
        
        
        let buttonPanel = new ButtonPanel(["Delete Box", "Describe Box"], false, SELECT_SINGLE,
            function (button, value) { 
                if (value && button.label == "Delete Box") {
                    if (test.selectedBox == null) {
                        test.message("No box is selected! (Try shift-clicking)");
                    } else {
                        topGroup.removeChild(test.selectedBox.attachedLabel);
                        objsGroup.removeChild(test.selectedBox);
                        test.selectedBox = null;
                    }   
                }

                if (value && button.label == "Describe Box") {
                    if (test.selectedBox == null) {
                        test.message("No box is selected! (Try shift-clicking)");
                    } else {
                        test.message("Here is your box:");
                        test.message(test.selectedBox.attachedLabel.text);
                        let bb = test.selectedBox.getBoundingBox();
                        test.message("x,y:" + (bb.x - objsGroup.x) +"," + (bb.y - objsGroup.y));
                        test.message("w,h:" + bb.width +"," + bb.height);
                    }
                    
                }
            },
            10, 400, 800, 40);

        topGroup.addChild(buttonPanel);

        await this.topGraphics.redraw();

        this.message("Ready!");
        this.message("Click and drag in the canvas to draw.")
        this.message("Shift-click to select a box (single selection). Shift-click on canvas to deselect. You can then delete the box or get its info.")
        this.message("Ctrl-click and drag to move a box.")
    }
}
