import Command from "./Command.js";

export default class DeleteNodeCommand extends Command {

    constructor(document, node) {

        super();

        this.document = document;

        this.node = node;

        this.parent = node.parent;

    }

    execute() {

        this.document.removeNode(this.node);

    }

    undo() {

        this.document.addNode(this.node, this.parent);

    }

}