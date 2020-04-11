class ButtonPanel extends LayoutGroup {

    get value() {
        return this._value.valueOf();
    }
    set value(value) {
        this._value = value;
        this.propagate("value");
    }

    constructor(labels = [], selectable = false, selectType = SELECT_SINGLE, onSelectionChange = function(object) {},
        x = 0, y = 0, width = 100, height = 100, layout = HORIZONTAL, offset = 10) {
        
        // LayoutGroup
        super(x, y, width, height, layout, offset);

        this.labels = labels;
        this.selectable = selectable;
        if (!this.selectable) {
            this.selectType = SELECT_SINGLE;
        } else {
            this.selectType = selectType;
        }

        let parent = this;
        
        // initialize value
        if (this.selectType == SELECT_SINGLE) {
            this._value = "";
        } else {
            this._value = new Set();
        }

        // enumerate buttons
        labels.forEach(label => {
            let text = null;
            if (label instanceof GraphicalObject) {
                text = label
            } else {
                text = new Text(label.toString(), 8, 8, "16pt sans-serif", "black")
            }

            let button = new FilledRect(0, 0, 0, 0, "white");
            let buttonGroup = new SimpleGroup(0, 0, 0, 0);
            if (label instanceof GraphicalObject) {
                buttonGroup.label = label.value;
            } else {
                buttonGroup.label = label;
            }
            buttonGroup.onSelectionChange = function(object, value) {
                if (parent.selectType == SELECT_SINGLE) {
                    if (value) {
                        parent.value = object.label;
                    } else {
                        parent.value = "";
                    }
                }

                if (parent.selectType == SELECT_MULTIPLE) {
                    if (value) {
                        parent.value = parent.value.add(object.label);
                    } else {
                        parent.value.delete(object.label);
                        parent.value = parent.value;
                    }
                }
                
                onSelectionChange(object, value);
            };
            
            button.width = new Constraint(button, "width", 0, function (a) {
                return text.getBoundingBox().width + 16;
            }, [
                new DependencyOn(text, "text")
            ]);

            button.height = new Constraint(button, "height", 0, function (a) {
                return text.getBoundingBox().height + 16;
            }, [
                new DependencyOn(text, "font")
            ]);
            
            button.color = new Constraint(button, "color", "lightgray", function (a, b) {
                if (a) {
                    if (b) {
                        return "lightsteelblue"; //both interimSelected and selected
                    } else {
                        if (selectable) {
                            return "steelblue"; // just selected and not interimSelected
                        } else {
                            return "lightgrey"; // do not show is selected
                        }
                    }
                } else {
                    if (b) {
                        return "lightsteelblue"; // just interimSelected and not selected
                    } else {
                        return "lightgrey"; // not selected
                    }
                }
            }, [
                new DependencyOn(buttonGroup, "selected"),
                new DependencyOn(buttonGroup, "interimSelected")
            ]);


            buttonGroup.width = new Constraint(buttonGroup, "width", 0, function (a) {
                return a;
            }, [
                new DependencyOn(button, "width")
            ]);

            buttonGroup.height = new Constraint(buttonGroup, "height", 0, function (a) {
                return a;
            }, [
                new DependencyOn(button, "height")
            ]);
            
            buttonGroup.addChild(button);
            buttonGroup.addChild(text);
            this.addChild(buttonGroup);
        });

        // this group should have the choice behavior
        
        this.addBehvaior(new ChoiceBehavior(this,
            new BehaviorEvent("LEFT_MOUSE_DOWN"),
            new BehaviorEvent("LEFT_MOUSE_UP"),
            new BehaviorEvent("ESC"),
            this.selectType,
            false
        ));
    }

}