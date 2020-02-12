const canvas = document.getElementById("drawCanvas");
const topGraphics = new TopGraphics (canvas);

/* PUT TESTING HERE */

/* only uncomment one of these at a time */
const t1 = new TestTestHarness(topGraphics);
// const t1 = new TestAllObjects(topGraphics);
// const t1 = new TestLayoutGroup(topGraphics);
// const t1 = new TestOutlineRect(topGraphics);
// const t1 = new TestSimpleGroup(topGraphics);

t1.runTest();
