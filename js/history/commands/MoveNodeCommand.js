import Command from "./Command.js";

export default class MoveNodeCommand extends Command {

    constructor(node, oldTransform, newTransform) {

        super();

        this.node = node;

        this.oldTransform = { ...oldTransform };

        this.newTransform = { ...newTransform };

    }

    execute() {

        Object.assign(this.node.transform, this.newTransform);

    }

    undo() {

        Object.assign(this.node.transform, this.oldTransform);

    }

}
