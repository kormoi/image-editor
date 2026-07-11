import Command from "./Command.js";

export default class AddNodeCommand extends Command {

    constructor(document, node, parent = null) {

        super();

        this.document = document;

        this.node = node;

        this.parent = parent;

    }

    execute() {

        this.document.addNode(this.node, this.parent);

    }

    undo() {

        this.document.removeNode(this.node);

    }

}