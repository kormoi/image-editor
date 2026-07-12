export default class SetArtboardSizeCommand {

    constructor(artboard, oldSize, newSize) {

        this.artboard = artboard;

        this.oldSize = oldSize;

        this.newSize = newSize;

    }

    execute() {

        this.artboard.transform.width = this.newSize.width;

        this.artboard.transform.height = this.newSize.height;

    }

    undo() {

        this.artboard.transform.width = this.oldSize.width;

        this.artboard.transform.height = this.oldSize.height;

    }

}