export default class Selection {

    constructor(editor) {

        this.editor = editor;

        this.nodes = [];

        this.currentStep = null;

    }

    add(node) {

        if (this.nodes.includes(node)) {

            return;

        }

        node.selected = true;

        this.nodes.push(node);

    }

    remove(node) {

        const index = this.nodes.indexOf(node);

        if (index === -1) {

            return;

        }

        node.selected = false;

        this.nodes.splice(index, 1);

    }

    toggle(node) {

        if (this.nodes.includes(node)) {

            this.remove(node);

        } else {

            this.add(node);

        }

    }

    set(nodes) {

        this.clear();

        this.nodes = [...nodes];

        this.nodes.forEach(node => {

            node.selected = true;

        });

    }

    select(node) {

        this.set([node]);

    }

    getBounds() {

        if (!this.nodes.length) {

            return null;

        }

        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;

        this.nodes.forEach(node => {

            const t = node.transform;

            left = Math.min(left, t.x);
            top = Math.min(top, t.y);

            right = Math.max(right, t.x + t.width);
            bottom = Math.max(bottom, t.y + t.height);

        });

        return {

            x: left,
            y: top,
            width: right - left,
            height: bottom - top

        };

    }

    beginTransform() {

        this.transformSession = this.nodes.map(node => ({

            id: node.id,

            before: structuredClone(node.transform)

        }));

    }

    endTransform() {

        if (!this.transformSession) {

            return;

        }

        const step = {

            changes: []

        };

        this.transformSession.forEach(item => {

            const node = this.editor.document.findNode(item.id);

            if (!node) return;

            step.changes.push({

                nodeId: node.id,

                property: "transform",

                before: structuredClone(item.before),

                after: structuredClone(node.transform)

            });

        });

        this.transformSession = null;

        if (step.changes.length) {

            this.editor.history.addStep(step);

        }

    }

    clear() {

        this.nodes.forEach(node => {

            node.selected = false;

        });

        this.nodes = [];

    }

    getPrimary() {

        return this.nodes[0] ?? null;

    }

    getSelected() {

        return this.nodes;

    }

}