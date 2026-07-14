import Command from "./Command.js";

export default class MoveSelectionCommand extends Command {

    constructor(items) {

        super();

        this.items = items;

    }

    execute() {

        this.items.forEach(item => {

            Object.assign(item.node.transform, item.newTransform);

        });

    }

    undo() {

        this.items.forEach(item => {

            Object.assign(item.node.transform, item.oldTransform);

        });

    }

}