export default class Node {

    constructor(type) {

        this.id = crypto.randomUUID();

        this.type = type;

        this.name = type;

        this.parent = null;

        this.children = [];

        this.visible = true;

        this.locked = false;

        this.selected = false;

        this.opacity = 1;

        this.transform = {

            x: 0,
            y: 0,

            width: 0,
            height: 0,

            rotation: 0,

            scaleX: 1,
            scaleY: 1

        };

    }

    add(node) {

        node.parent = this;

        this.children.push(node);

    }

    remove(node) {

        const index = this.children.indexOf(node);

        if (index !== -1) {

            this.children.splice(index, 1);

            node.parent = null;

        }

    }

    clear() {

        this.children = [];

    }

    traverse(callback) {

        callback(this);

        for (const child of this.children) {

            child.traverse(callback);

        }

    }

}