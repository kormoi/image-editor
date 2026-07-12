export default class SetArtboardBackgroundCommand {

    constructor(artboard, oldBackground, newBackground) {

        this.artboard = artboard;

        this.oldBackground = structuredClone(oldBackground);

        this.newBackground = structuredClone(newBackground);

    }

    execute() {

        this.artboard.background = structuredClone(this.newBackground);

    }

    undo() {

        this.artboard.background = structuredClone(this.oldBackground);

    }

}