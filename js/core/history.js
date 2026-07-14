export default class History {

    constructor(editor) {

        this.editor = editor;

        this.steps = [];

        this.currentStep = -1;

        this.maxSteps = 100;

    }

    addStep(step) {

        if (!step) return;

        while (this.steps.length - 1 > this.currentStep) {

            this.steps.pop();

        }

        if (this.steps.length >= this.maxSteps) {

            this.steps.shift();

            this.currentStep--;

        }

        step.number = this.currentStep + 1;

        this.steps.push(step);

        this.currentStep++;

    }

    undo() {

        if (this.currentStep < 0) {

            return;

        }

        const step = this.steps[this.currentStep];

        this.applyStep(step, "before");

        this.currentStep--;

        this.editor.renderer.render();

    }

    redo() {

        if (this.currentStep >= this.steps.length - 1) {

            return;

        }

        this.currentStep++;

        const step = this.steps[this.currentStep];

        this.applyStep(step, "after");

        this.editor.renderer.render();

    }

    applyStep(step, state) {

        if (!step.changes) {

            return;

        }

        step.changes.forEach(change => {

            const node = this.editor.document.findNode(change.nodeId);

            if (!node) {

                return;

            }

            switch (change.property) {

                case "transform":

                    node.transform = structuredClone(change[state]);

                    break;

            }

        });

    }

    clear() {

        this.steps.length = 0;

        this.currentStep = -1;

    }

}