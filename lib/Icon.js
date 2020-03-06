/* class to create an image
    imageFile is a string of the name of the file, can be local file or URL
    x, y are position of the image
    if the height and width are undefined, then they are gotten from the image's width and height
*/
class Icon extends GraphicalObject {
    constructor(imageFile = undefined, x = 0, y = 0, width = undefined, height = undefined) {
        super(x, y);
        this.width = width; this.height = height; this.imageFile = imageFile;
    }

    loadImage(url) {
        return new Promise(resolve => {
            const image = new Image();
            image.addEventListener("load", () => {
                resolve(image);
            });
            image.src = url;
        });
    }

    async draw(ctx) {
        if (this.group == null) {
            return null;
        }

        if (this.x != this.originalX + this.group.x) {
            this.originalX = this.x;
        }
        if (this.y != this.originalY + this.group.y) {
            this.originalY = this.y;
        }

        this.recalcForGroup();

        const img = await this.loadImage(this.imageFile);
        if (this.width == undefined || this.height == undefined) {
            this.width = img.width;
            this.height = img.height;
        }
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }

    async getBoundingBox() {
        const img = await this.loadImage(this.imageFile);
        return {
            x: this.x,
            y: this.y,
            width: img.width,
            height: img.height
        }
    }
}