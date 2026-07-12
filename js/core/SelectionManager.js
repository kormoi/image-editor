export default class SelectionManager {

    constructor(editor) {

        this.editor = editor;

        this.nodes = [];

    }

    clear() {

        this.nodes.forEach(node => {

            node.selected = false;

        });

        this.nodes = [];

    }

    select(node) {

        this.clear();

        node.selected = true;

        this.nodes.push(node);

    }

    getPrimary() {

        return this.nodes[0] ?? null;

    }

}