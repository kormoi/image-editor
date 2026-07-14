export default class Selection {

    constructor(editor) {

        this.editor = editor;

        this.nodes = [];

        this.currentStep = null;

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

}