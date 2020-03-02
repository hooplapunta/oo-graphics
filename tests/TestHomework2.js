//    <script src="../TestHomework2.js"></script>
// const t1 = new TestHomework2(topGraphics);

class TestHomework2 extends TestHarness {

	async runTest() {
		let windowgroup = new SimpleGroup(0, 0, 300, 400);
		await this.topGraphics.addChild(windowgroup);
		var tG = this;
		const ctx = this.topGraphics.ctx;
		let group = new SimpleGroup(0, 0, 300, 400);
		let iconStr = "tests/jslogoSmall.png"; // may need to adjust pathname "../../jslogoSmall.png"
		let bounds; // boundary rectangle

		this.message("1. creating blue rect, thick = 4, x,y=0");
		let r = new OutlineRect(0, 0, 50, 80, "blue", 4);

		windowgroup.addChild(group);
		group.addChild(r);
		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("2. moving to 30,30");
		await this.waitForUser();
		await r.moveTo(30, 30);
		await this.topGraphics.redraw();

		this.message("3. remove from group--see if goes away");
		await this.waitForUser();
		group.removeChild(r);
		await this.topGraphics.redraw();

		this.message("4. put back; overlap with a red rectangle");
		await this.waitForUser();
		group.addChild(r);

		let r2 = new OutlineRect(10, 20, 50, 80, "red", 8);
		group.addChild(r2);
		await this.topGraphics.redraw();

		this.message("5. bring blue to front");
		await this.waitForUser();
		group.bringChildToFront(r);
		await this.topGraphics.redraw();

		this.message("6. moving red rect while behind blue");
		await this.waitForUser();
		await r2.moveTo(20, 30);
		await this.topGraphics.redraw();

		this.message("7. change color of red rectangle to green");
		await this.waitForUser();
		r2.color = "green";
		await this.topGraphics.redraw();

		this.message("8. Creating Filled Yellow Rect");
		await this.waitForUser();
		let r3 = new FilledRect(30, 40, 100, 20, "yellow");
		group.addChild(r3);
		await this.topGraphics.redraw();

		this.message("9. Putting yellow next to blue");
		await this.waitForUser();
		bounds = await r.getBoundingBox();
		await r3.moveTo(bounds.x + bounds.width, bounds.y + (bounds.height / 2));
		await this.topGraphics.redraw();

		this.message("10. creating lines and icons");
		await this.waitForUser();

		this.message("10.a Line");
		await this.waitForUser();

		let line1 = new Line(70, 130, 120, 180, "blue", 10);
		group.addChild(line1);
		group.addChild(new Line(10, 130, 10, 180, "black", 1));
		group.addChild(new Line(20, 130, 60, 130, "red", 3));
		await this.topGraphics.redraw();

		this.message("10.b Icon logo");
		await this.waitForUser();
		var iconLogo = new Icon(iconStr, 10, 200);
		group.addChild(iconLogo);
		await this.topGraphics.redraw();

		this.message("10.c Icon dog");
		await this.waitForUser();
		let icon1 = new Icon("tests/dog.png", 80, 200); //may need to adjust pathname  tests/dog.png
		group.addChild(icon1);
		await this.topGraphics.redraw();

		this.message("11. moving blue line behind red line using setX1");
		await this.waitForUser();
		line1.x1 = 40;
		line1.y1 = 110;
		await this.topGraphics.redraw();

		this.message("12. moving blue line behind black line using moveTo");
		await this.waitForUser();
		await line1.moveTo(1, 150);
		await this.topGraphics.redraw();

		this.message("13. moving big icon using setX");
		await this.waitForUser();
		icon1.x = 30;
		await this.topGraphics.redraw();

		this.message("14. moving big icon in front of little icon");
		await this.waitForUser();
		await icon1.moveTo(30, 220);
		await this.topGraphics.redraw();

		this.message("15. Test group clipping");
		await this.waitForUser();
		group.addChild(new Line(299, 0, 299, 400, "black", 1));
		await this.topGraphics.redraw();
		this.message("15a. filledrect");
		await this.waitForUser();
		group.addChild(new FilledRect(250, 100, 100, 40, "yellow"));
		this.topGraphics.redraw();

		this.message("15b. line");
		await this.waitForUser();
		group.addChild(new Line(250, 110, 400, 200, "green", 4));
		await this.topGraphics.redraw();

		this.message("15c. text");
		await this.waitForUser();
		group.addChild(new Text("reallyLongStringShouldGetCutOff", 240, 200,
			"bold 20px Serif", "black", ctx));
		//  new Font ("Serif", Font.BOLD, 20),
		// example: "italic bold 20px arial,serif";
		await this.topGraphics.redraw();

		this.message("15d. outline rect");
		await this.waitForUser();
		group.addChild(new OutlineRect(250, 300, 100, 40, "red"));
		await this.topGraphics.redraw();

		await this.topGraphics.redraw();

		let lg = new LayoutGroup(0, 0, 400, 400, VERTICAL, 2);
		this.message("16: about to remove all. Get ready for different groups");
		await this.waitForUser();
		windowgroup.removeChild(group);
		await this.topGraphics.redraw();
		await this.waitForUser();

		let la1 = new OutlineRect(0, 0, 50, 80, "orange", 4);
		let la2 = new FilledRect(60, 100, 10, 30, "yellow");
		let la3 = new Line(10, 200, 70, 20, "red", 8);
		let la4 = new Icon(iconStr, 0, 10);
		let lb1 = new OutlineRect(0, 0, 50, 80, "orange", 4);
		let lb2 = new FilledRect(60, 100, 10, 30, "yellow");
		let lb3 = new Line(10, 200, 70, 20, "red", 8);
		let lb4 = new Icon(iconStr, 0, 10);

		this.message("17. adding new objects to simplegroup");
		await this.waitForUser();

		let topgroup = new SimpleGroup(0, 0, 400, 400);

		windowgroup.addChild(topgroup);
		let sgroup = new SimpleGroup(10, 10, 200, 400);
		topgroup.addChild(sgroup);
		sgroup.addChild(la1);
		sgroup.addChild(la2);
		sgroup.addChild(la3);
		sgroup.addChild(la4);
		await this.topGraphics.redraw();


		this.message("18. adding new objects to layoutgroup");
		await this.waitForUser();
		let layoutgroup = new LayoutGroup(220, 0, 150, 400,
			VERTICAL, 2);
		await layoutgroup.addChild(lb1);
		await layoutgroup.addChild(lb2);
		await layoutgroup.addChild(lb3);
		await layoutgroup.addChild(lb4);
		topgroup.addChild(layoutgroup);
		await this.topGraphics.redraw();

		this.message("19. removing long line from layout group");
		await this.waitForUser();
		layoutgroup.removeChild(lb3);
		await this.topGraphics.redraw();

		this.message("20. moving simple group to right and down");
		await this.waitForUser();
		await sgroup.moveTo(30, 30);
		await this.topGraphics.redraw();

		this.message("21. changing layout group's offset to 30");
		await this.waitForUser();
		layoutgroup.offset = 30;
		await this.topGraphics.redraw();

		this.message("22. changing layout group to horizontal at x=10");
		await this.waitForUser();
		layoutgroup.x = 10;
		layoutgroup.y = 200;
		layoutgroup.layout = HORIZONTAL;
		await this.topGraphics.redraw();

		this.message("23. changing layout group to be wider");
		await this.waitForUser();
		layoutgroup.width = 400;
		await this.topGraphics.redraw();

		this.message("23a. moving filled rect in layout group to see what happens");
		await this.waitForUser();
		lb2.y = 20;
		await this.topGraphics.redraw();

		this.message("23b. moving simplegroup to try to make sure visible");
		await this.waitForUser();
		await sgroup.moveTo(35, 0);
		await this.topGraphics.redraw();

		this.message("23c. resize simplegroup to children. Bounds should be (35,0,200,400). Then (35,0,~75,~205)");
		bounds = await sgroup.getBoundingBox();
		if (bounds !== undefined)
			this.message("   before bounds = " + bounds.x + ", " + bounds.y + ", " + bounds.width + ", " + bounds.height);
		else this.message("getBoundingBox returned UNDEFINED, but width = " + sgroup.width + ", height=" + sgroup.height);
		await sgroup.resizeToChildren();
		bounds = await sgroup.getBoundingBox();
		if (bounds !== undefined)
			this.message("    after bounds = " + bounds.x + ", " + bounds.y + ", " + bounds.width + ", " + bounds.height);
		else this.message("getBoundingBox returned UNDEFINED, but width = " + sgroup.width + ", height=" + sgroup.height);

		//Scaled group is supposed to be implemented
		this.message("24. New scale group with scale = 0.5, 2.0");
		await this.waitForUser();
		let lc1 = new OutlineRect(0, 0, 50, 80, "orange", 4);
		let lc2 = new FilledRect(60, 100, 10, 30, "yellow");
		let lc3 = new Line(10, 200, 70, 20, "red", 8);
		let lc4 = new Icon(iconStr, 0, 10);
		let scalegroup = new ScaledGroup(220, 0, 150, 400, 0.5, 2.0);
		scalegroup.addChild(lc1);
		scalegroup.addChild(lc2);
		scalegroup.addChild(lc3);
		scalegroup.addChild(lc4);
		topgroup.addChild(scalegroup);
		await this.topGraphics.redraw();

		this.message("25. Change the scale to be even smaller: 0.2, 0.4");
		await this.waitForUser();
		scalegroup.scaleX = 0.2;
		scalegroup.scaleY = 0.4;
		await this.topGraphics.redraw();
		await this.waitForUser();

		this.message("removing all. Getting ready for different groups");
		windowgroup.removeChild(topgroup);
		await this.waitForUser();
		await this.topGraphics.redraw();

		this.message("26. Test overlapping regions");
		await this.waitForUser();
		this.message("26a. first group");
		let topgroup2 = new SimpleGroup(0, 0, 400, 400);
		windowgroup.addChild(topgroup2);
		let sgroup2 = new SimpleGroup(10, 10, 200, 400);
		let ld1 = new FilledRect(30, 20, 70, 150, "yellow");
		let ld2 = new FilledRect(10, 60, 110, 70, "green");
		sgroup2.addChild(ld1);
		sgroup2.addChild(ld2);
		topgroup2.addChild(sgroup2);
		await this.topGraphics.redraw();

		this.message("26b. adding second group to the right of the first");
		await this.waitForUser();
		let sgroup3 = new SimpleGroup(175, 10, 200, 400);
		let le1 = new FilledRect(30, 20, 70, 150, "red");
		let le2 = new FilledRect(10, 60, 110, 70, "blue");
		sgroup3.addChild(le1);
		sgroup3.addChild(le2);
		topgroup2.addChild(sgroup3);
		await this.topGraphics.redraw();

		this.message("26c. move r-b second group to be on top of first");
		await this.waitForUser();
		await sgroup3.moveTo(45, 35);
		await this.topGraphics.redraw();

		this.message("26d. change color on top: red -> gray");
		await this.waitForUser();
		le1.color = "gray";
		await this.topGraphics.redraw();

		this.message("26e. change color on bottom: yellow -> black");
		await this.waitForUser();
		ld1.color = "black";
		await this.topGraphics.redraw();

		this.message("26f. move black on bottom");
		await this.waitForUser();
		ld1.moveTo(15, 10);
		await this.topGraphics.redraw();


		this.message("DONE. close the window to stop");

	}

}
