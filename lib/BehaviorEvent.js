
/* this class converts UIEvent and its subclasses MouseEvent and KeyboardEvent into more convenient strings
like "LEFT_MOUSE_DOWN". When created from a string like "CONTROL_K", it will leave x,y as 0,0, but the event version
can specify all the fields.

Fields of a BehaviorEvent will include at least:
    x, y: of the event, in the global (window) coordinate system
    id - what type of event, like mouse button or keyboard key
    modifiers - whether the following are down (true) or not (false): shift, control, alt, windows, function, command
    key - the actual key or button, like f or esc or left_mouse_down
*/

class BehaviorEvent {
    constructor(eventOrString) {
        if (typeof (eventOrString) === 'string')
            this.BehaviorEventFromString(eventOrString);
        else if (eventOrString instanceof UIEvent)
            this.BehaviorEventFromUIEvent(eventOrString);
        else console.error("wrong type of parameter to create a BehaviorEvent");
    }
    /* 
     set my fields from a string like "CONTROL_LEFT_MOUSE_DOWN" or "SHIFT_F1" or "ESC".
     Modifiers are required to be listed first.
    */
    BehaviorEventFromString(eventString) {
        this.x = 0;
        this.y = 0;

        // check if keyboard or mouse

        if (eventString.includes("MOUSE")) {
            this.id = "MOUSE";

            this.alt = eventString.includes("ALTERNATE") || eventString.includes("ALT");
            this.ctrl = eventString.includes("CONTROL") || eventString.includes("CTRL");
            this.shift = eventString.includes("SHIFT") || eventString.includes("SHFT");
            this.meta = eventString.includes("COMMAND") || eventString.includes("CMD") || eventString.includes("WINDOWS") || eventString.includes("WIN")

            if (eventString.includes("LEFT")) {
                this.key = 0;
            } else if (eventString.includes("MIDDLE")) {
                this.key = 1;
            } else if (eventString.includes("RIGHT")) {
                this.key = 2;
            } else {
                this.key = 3;
            }
            
            this.direction = eventString.split("_").pop();
        } else {
            this.id = "KEYBOARD";

            this.alt = eventString.includes("ALTERNATE") || eventString.includes("ALT");
            this.ctrl = eventString.includes("CONTROL") || eventString.includes("CTRL");
            this.shift = eventString.includes("SHIFT") || eventString.includes("SHFT");
            this.meta = eventString.includes("COMMAND") || eventString.includes("CMD") || eventString.includes("WINDOWS") || eventString.includes("WIN")

            this.key = eventString.split("_").pop();
            this.direction = "PRESS";
        }
    }

    /* 
     set my fields from a UIEvent object, which will probably either be a MouseEvent and KeyboardEvent"
    */
    BehaviorEventFromUIEvent(uiEvent) {
        if (uiEvent instanceof KeyboardEvent) {
            this.x = 0;
            this.y = 0;
            this.id = "KEYBOARD";

            this.alt = uiEvent.altKey;
            this.ctrl = uiEvent.ctrlKey;
            this.shift = uiEvent.shiftKey;
            this.meta = uiEvent.metaKey;

            this.key = uiEvent.key;

            if (uiEvent.type == "keypress") {
                this.direction = "PRESS"
            }

            if (uiEvent.type == "keydown") {
                this.direction = "DOWN"
            }

            if (uiEvent.type == "keyup") {
                this.direction = "UP"
            }
        }

        if (uiEvent instanceof MouseEvent) {
            this.x = uiEvent.clientX;
            this.y = uiEvent.clientY;
            this.id = "MOUSE";

            this.alt = uiEvent.altKey;
            this.ctrl = uiEvent.ctrlKey;
            this.shift = uiEvent.shiftKey;
            this.meta = uiEvent.metaKey;

            this.key = uiEvent.button;

            // may be a WheelEvent
            this.deltaX = uiEvent.deltaX;
            this.deltaY = uiEvent.deltaY;
            this.deltaZ = uiEvent.deltaZ;

            if (uiEvent.type == "click") {
                this.direction = "CLICK"
            }

            if (uiEvent.type == "dblclick") {
                this.direction = "DBLCLICK"
            }

            if (uiEvent.type == "mouseup") {
                this.direction = "UP"
            }

            if (uiEvent.type == "mousedown") {
                this.direction = "DOWN"
            }

            if (uiEvent.type == "mousemove") {
                this.direction = "NONE"
            }
        }
    }

    /* 
      checks if the parameter matches this. Ignores fields like x,y and only looks at the modifiers (SHIFT, CONTROL)
      id (like mouse or keyboard) and key (like left_mouse_down or y or esc)
    */
    matches(other) {
        return this.id == other.id
            && this.alt == other.alt
            && this.ctrl == other.ctrl
            && this.shift == other.shift
            && this.meta == other.meta
            && this.key == other.key
            && this.direction == other.direction;
    }

    looselyMatches(other) {
        return this.id == other.id
            && this.key == other.key
            && this.direction == other.direction;
    }

    /* returns a string describing this event, ignoring the X,Y, etc. The returned string, if passed to matches() should
       return true with this object
    */
    toString() {
        return this.id + "_" + this.alt + "_" + this.ctrl + "_" + this.shift + "_" + this.meta + "_" + this.key;
    }
}
