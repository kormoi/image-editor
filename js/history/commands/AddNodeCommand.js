export default class AddNodeCommand {

    constructor(document, node) {

        this.document = document;

        this.node = node;

    }

    execute() {

        this.document.addNode(this.node);

    }

    undo() {

        this.document.removeNode(this.node);

    }

}