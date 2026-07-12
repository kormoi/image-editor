export default class RenameArtboardCommand {

    constructor(artboard, oldName, newName) {

        this.artboard = artboard;

        this.oldName = oldName;

        this.newName = newName;

    }

    execute() {

        this.artboard.name = this.newName;

    }

    undo() {

        this.artboard.name = this.oldName;

    }

}