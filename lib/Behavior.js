/* top level behavior class. Create subclasses
  for MoveBehavior, ChoiceBehavior, etc.
  */

const IDLE = 0;
const RUNNING_INSIDE = 1;
const RUNNING_OUTSIDE = 2;

class Behavior {

    constructor(group = UNDEFINED,
        startEvent = new BehaviorEvent("LEFT_MOUSE_DOWN"),
        stopEvent = new BehaviorEvent("LEFT_MOUSE_UP"),
        abortEvent = new BehaviorEvent("ESCAPE"),
        allowLooseStop = false
    ) {
        this.group = group;
        this.startEvent = startEvent;
        this.stopEvent = stopEvent;
        this.abortEvent = abortEvent;
        this.allowLooseStop = allowLooseStop;

        this.state = IDLE;
        this.affectedObject = null;  // will be an object in the group 

    }

    /* Test whether should start based on incoming BehaviorEvent. Check to see if event matches this.startEvent, and if
    a member of this.group contains the event location, as appropriate. Return true if this interactor starts,
    and therefore consumes the event. Also will change this.state appropriately.
    */
    start(event) {
        // do appropriate checks and start behavior if appropriate
        if (this.startEvent.matches(event)) {

            var child = this.group.childAtPoint(event.x, event.y);
            this.affectedObject = child;

            // we might start even withouth a found child (e.g. deselection)
            // let the implementation decide

            // check if we are inside or outside bounds
            this.state = RUNNING_OUTSIDE;
            var bb = this.group.getBoundingBox();
            if (event.x >= bb.x && event.x <= bb.x + bb.width
                && event.y >= bb.y && event.y <= bb.y + bb.height) {
                this.state = RUNNING_INSIDE;
            }

            return this.doStart(event);

        }

        // expected event does not match, do not start
        return false;
    }

    /* process this BehaviorEvent for this behavior, which will often be a MOUSE_MOVED event. 
    Be sure to test whether should switch to RUNNING_INSIDE or RUNNING_OUTSIDE.
    Check to see if the event matches this.STOP_EVENT or the ABORT_EVENT, and if so, directly call stop() or abort(). 
    Return true if this behavior consumes the event, and false if not.*/
    running(event) {
        // first update state
        this.state = RUNNING_OUTSIDE;
        var bb = this.group.getBoundingBox();
        if (event.x >= bb.x && event.x <= bb.x + bb.width
            && event.y >= bb.y && event.y <= bb.y + bb.height) {
            this.state = RUNNING_INSIDE;
        }

        if (this.stopEvent.matches(event)
            || (this.allowLooseStop && this.stopEvent.looselyMatches(event))) {
            return this.stop(event);
        }

        if (this.abortEvent.looselyMatches(event)) {
            return this.cancel(event);
        }

        if (this.startEvent.keyMatches(event)) {
            this.doRun(event);
        }

        return false;
    }

    /* check to see if the BehaviorEvent matches this.STOP_EVENT and if so, stop and perform the behavior. Returns true if stops, else returns false. */
    stop(event) {
        //do behavior-relevant stopping stuff, like actually changing the affected object
        if (this.stopEvent.matches(event)
            || (this.allowLooseStop && this.stopEvent.looselyMatches(event))) {
            this.state = IDLE;
            return this.doStop(event);
        }

        return false;
    }

    /* check to see if the BehaviorEvent matches this.CANCEL_EVENT and if so, cancel the behavior as if the behavior was never started.
    Returns true if stops, else returns false. */
    cancel(event) {
        if (this.abortEvent.looselyMatches(event)) {
            this.state = IDLE;
            return this.doCancel(event);
        }

        return false;
    }

    /* to be filled in by the Behvaior to complete their implementation */
    doStart(event) { }
    doRun(event) { }
    doStop(event) { }
    doCancel(event) { }
}

// *** NOTE: You should move each behavior into its own .js file for ease of editing

/* move the object in group that startEvent is on. MoveBehavior has no extra parameters.
*/
class MoveBehavior extends Behavior {

    doStart(event) {
        // only start moving when on an object
        if (this.state == RUNNING_INSIDE && this.affectedObject != null) {
            // keep track of the original state and where we started
            // console.log(event.x);
            // console.log(this.group.getBoundingBox().x)
            this.startX = event.x - this.group.getBoundingBox().x;
            this.startY = event.y - this.group.getBoundingBox().y;

            this.originalX = this.affectedObject.x;
            this.originalY = this.affectedObject.y;
            return true;
        }
        return false;
    }

    doRun(event) {
        if (this.state == RUNNING_INSIDE && this.affectedObject != null) {
            this.affectedObject.moveTo(
                this.originalX + (event.x - this.group.getBoundingBox().x - this.group.getBoundingBox().x - this.startX),
                this.originalY + (event.y - this.group.getBoundingBox().y - this.startY)
            );
            return true;
        }
        return false;
    }

    doStop(event) {
        // moving has already occurred, nothing to do
        this.affectedObject = null;
        return true;
    }

    doCancel(event) {
        // put it back!
        if (this.affectedObject != null) {
            this.affectedObject.moveTo(this.originalX, this.originalY);
            return true;
        }
        return false;
    }

}


const SELECT_SINGLE = 0;
const SELECT_MULTIPLE = 1;

/* allows user to select one (if selectType==SELECT_SINGLE) or more if selectType==SELECT_MULTIPLE) of the objects in the group.
  If firstOnly is false, then as move around, interimSelected can move from item to item in group.
  If firstOnly is true, then will only affect the first object that the behavior starts on.
  Sets the selected and interimSelected fields of the object in the group appropriately. 
  There should be constraints from graphical properties that use selected and interimSelected.
*/
class ChoiceBehavior extends Behavior {
    constructor(group = UNDEFINED,
        startEvent = new BehaviorEvent("LEFT_MOUSE_DOWN"),
        stopEvent = new BehaviorEvent("LEFT_MOUSE_UP"),
        abortEvent = new BehaviorEvent("ESCAPE"),
        selectType = SELECT_SINGLE, firstOnly = true) {
        super(group, startEvent, stopEvent, abortEvent);

        this.selectType = selectType;
        this.firstOnly = firstOnly;
        this.interimObjects = new Set();
        this.selectedObjects = new Set();
    }

    /* getSelection returns the current list of selected objects. Returns an empty list if nothing selected. 
       Even in SELECT_SINGLE mode, always returns a list, which then will have 0 or 1 element in the list.
    */
    getSelection() {
        return Array.from(this.selectedObjects);
    }

    doStart(event) {
        if (this.state == RUNNING_INSIDE) {
            // first we need to know if any objects were previously selected

            // single selection mode
            if (this.selectType == SELECT_SINGLE) {
                if (this.affectedObject != null) {
                    // update selection if an object was selected
                    this.affectedObject.interimSelected = true;
                    this.interimObjects.add(this.affectedObject); // only add to interim, will select when stopped
                    return true;
                } else {
                    // still register as started so that selection can be cleared
                    // console.log("selection outside within group");
                    return true;
                }
            }

            // multi selection mode
            if (this.selectType == SELECT_MULTIPLE) {
                // only act if an object was actioned on 
                if (this.affectedObject != null) {
                    this.affectedObject.interimSelected = true;
                    this.interimObjects.add(this.affectedObject);
                    return true;
                }
            }
        }
        return false;
    }

    doRun(event) {
        if (this.state == RUNNING_INSIDE) {

            // remove all the interim selections
            this.clearInterim();

            // re-add the current object under the mouse
            var child = this.group.childAtPoint(event.x, event.y);
            if (child != null) {

                if (child == this.affectedObject || !this.firstOnly) {
                    // we can re-selected the given object 
                    // or switch the selection if allowed 

                    child.interimSelected = true;
                    this.interimObjects.add(child);
                }

            }

            return true;

        }
        return false;
    }

    doStop(event) {
        // single selection type can only have one selected item
        if (this.selectType == SELECT_SINGLE 
            && (this.interimObjects.size > 0 || this.affectedObject == null)) {
            this.clearSelected();
        }

        // clear the interim selection, make the final selection
        this.interimObjects.forEach(object => {
            object.interimSelected = false;

            if (object.selected) {
                // if the object was previously selected, deselect
                object.selected = false;
                this.selectedObjects.delete(object);
            } else {
                object.selected = true;
                this.selectedObjects.add(object);
            }

        });

        this.clearInterim();
        return true;
    }

    doCancel(event) {
        // clear any interim selections
        // this.clearSelected();
        this.clearInterim();
        return true;
    }

    clearInterim() {
        this.interimObjects.forEach(object => {
            object.interimSelected = false;
        });

        this.interimObjects.clear();
    }

    clearSelected() {
        this.selectedObjects.forEach(object => {
            object.selected = false;
        });

        this.selectedObjects.clear();
    }
}

/* allows user to create a new instance of protoObjToMake, which is added to this.group.
if onePoint is true, then creates the object immediately when this.startevent happens.
if asLine is true, then creates a new line-type object that is defined by x1,y1,x2,y2, otherwise, if false, 
    creates an object that takes x,y,width,height.
If onePoint is false, then uses interimFeedbackObj as the feedback until this.stopEvent or this.cancelEvent,
and then creates the new object on stopEvent.
Creates the object by calling the makeObjFunction, passing in the coordinates from the mouse, 
    either as a line or rectangle.
*/
class NewBehavior extends Behavior {
    constructor(group = UNDEFINED,
        startEvent = new BehaviorEvent("LEFT_MOUSE_DOWN"),
        stopEvent = new BehaviorEvent("LEFT_MOUSE_UP"),
        abortEvent = new BehaviorEvent("ESC"),
        onePoint = false,
        asLine = false,
        makeObjFunction = function (a, b, c, d) { return null },
        interimFeedbackObj = null) {
        super(group, startEvent, stopEvent, abortEvent, true);
        this.onePoint = onePoint;
        this.asLine = asLine;
        this.makeObjFunction = makeObjFunction;
        this.interimFeedbackObj = interimFeedbackObj;
    }

    doStart(event) {
        // start a new object
        if (this.state == RUNNING_INSIDE) {
            // keep track of the and where we started
            this.startX = event.x - this.group.getBoundingBox().x;
            this.startY = event.y - this.group.getBoundingBox().y;

            // create feedback object
            if (!this.onePoint && this.interimFeedbackObj != null) {
                this.group.addChild(this.interimFeedbackObj);
                if (this.asLine) {
                    this.interimFeedbackObj.x1 = this.startX;
                    this.interimFeedbackObj.y1 = this.startY;
                    this.interimFeedbackObj.x2 = this.startX;
                    this.interimFeedbackObj.y2 = this.startY;
                } else {
                    this.interimFeedbackObj.x = this.startX;
                    this.interimFeedbackObj.y = this.startY;
                    this.interimFeedbackObj.width = 0;
                    this.interimFeedbackObj.height = 0;
                }

                this.group.addChild(this.interimFeedbackObj);
            }

            return true;
        }
        return false;
    }

    doRun(event) {
        if (this.state == RUNNING_INSIDE) {
            this.endX = event.x - this.group.getBoundingBox().x;
            this.endY = event.y - this.group.getBoundingBox().y;

            if (!this.onePoint) {
                if (this.asLine) {
                    // give feedback as line
                    // update feedback object
                    if (this.interimFeedbackObj != null) {
                        this.interimFeedbackObj.x2 = this.endX;
                        this.interimFeedbackObj.y2 = this.endY;
                    }
                } else {
                    // give feedback as something with a fixed width/height
                    // update feedback object
                    if (this.interimFeedbackObj != null) {
                        this.interimFeedbackObj.width = this.endX - this.startX;
                        this.interimFeedbackObj.height = this.endY - this.startY;
                    }
                }
            }
            return true;
        }
        return false;
    }

    doStop(event) {
        this.endX = event.x - this.group.getBoundingBox().x;
        this.endY = event.y - this.group.getBoundingBox().y;

        // remove the feedback object
        this.group.removeChild(this.interimFeedbackObj);

        // finish creating the object
        if (Math.abs(this.endX - this.startX) > 0 && Math.abs(this.endY - this.startY) > 0) {
            var newChild = null;
            if (this.onePoint) {
                newChild = this.makeObjFunction(this.startX, this.startY, 0, 0);
            } else {
                if (this.asLine) {
                    newChild = this.makeObjFunction(this.startX, this.startY, this.endX, this.endY);
                } else {
                    newChild = this.makeObjFunction(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
                }
            }

            this.group.addChild(newChild);
        }
        
        return true;
    }

    doCancel(event) {
        // remove the feedback object
        this.group.removeChild(this.interimFeedbackObj);
        return true;
    }

}