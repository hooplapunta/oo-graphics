class RadioPanel extends LayoutGroup {

    get value() {
        return this._value.valueOf();
    }
    set value(value) {
        this._value = value;
        this.propagate("value");
    }

    constructor(labels = [], onSelectionChange = function(object, value) {},
        x = 0, y = 0, width = 100, height = 100, layout = HORIZONTAL, offset = 10) {
        
        // LayoutGroup
        super(x, y, width, height, layout, offset);

        this.labels = labels;
        this._value = "";

        let parent = this;
    
        // enumerate buttons
        this.labels.forEach(label => {
            let text = null;
            if (label instanceof GraphicalObject) {
                label.x = 24;
                label.y = 1;
                text = label
            } else {
                text = new Text(label.toString(), 24, 1, "16pt sans-serif", "black");
            }
            let button = new Text(label, 0, 0, "20pt sans-serif", "black");
            let buttonGroup = new SimpleGroup(0, 0, 0, 0);

            if (label instanceof GraphicalObject) {
                buttonGroup.label = label.value;
            } else {
                buttonGroup.label = label;
            }

            buttonGroup.onSelectionChange = function(object, value) {
                if (value) {
                    parent.value = object.label;
                } else {
                    parent.value = "";
                }
                onSelectionChange(object, value);
            };
            
            button.text = new Constraint(button, "text", "\u2610", function (a, b) {
                if (a) {
                    if (b) {
                        return "\u2299"; // both interimSelected and selected
                    } else {
                        return "\u29BF"; // just selected and not interimSelected
                    }
                } else {
                    if (b) {
                        return "\u2299"; // just interimSelected and not selected
                    } else {
                        return "\u29BE"; // not selected
                    }
                }
            }, [
                new DependencyOn(buttonGroup, "selected"),
                new DependencyOn(buttonGroup, "interimSelected")
            ]);


            buttonGroup.width = new Constraint(buttonGroup, "width", 0, function (a, b) {
                return button.getBoundingBox().width + 24 + text.getBoundingBox().width;
            }, [
                new DependencyOn(button, "text"),
                new DependencyOn(text, "text")
            ]);

            buttonGroup.height = new Constraint(buttonGroup, "height", 0, function (a, b) {
                return Math.max(button.getBoundingBox().height, text.getBoundingBox().height) + 1;
            }, [
                new DependencyOn(button, "font"),
                new DependencyOn(text, "font")
            ]);
            
            buttonGroup.addChild(button);
            buttonGroup.addChild(text);
            this.addChild(buttonGroup);

            // console.log(label);
            // console.log(buttonGroup.getBoundingBox());
        });

        // this group should have the choice behavior
        
        this.addBehvaior(new ChoiceBehavior(this,
            new BehaviorEvent("LEFT_MOUSE_DOWN"),
            new BehaviorEvent("LEFT_MOUSE_UP"),
            new BehaviorEvent("ESC"),
            SELECT_SINGLE,
            false
        ));
        
        this.behaviors[0].state = RUNNING_INSIDE;
        this.behaviors[0].affectedObject = this.children[0];
        this.behaviors[0].doStart(null);
        this.behaviors[0].doStop(null);
    }

}