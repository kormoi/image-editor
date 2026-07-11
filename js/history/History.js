export default class History {

    constructor(editor) {

        this.editor = editor;

        this.undoStack = [];

        this.redoStack = [];

        this.maxSteps = 100;

    }

    execute(command) {

        command.execute();

        this.undoStack.push(command);

        this.redoStack.length = 0;

        if (this.undoStack.length > this.maxSteps) {

            this.undoStack.shift();

        }

    }

    undo() {

        if (!this.undoStack.length) return;

        const command = this.undoStack.pop();

        command.undo();

        this.redoStack.push(command);

        this.editor.renderer.render();

    }

    redo() {

        if (!this.redoStack.length) return;

        const command = this.redoStack.pop();

        command.execute();

        this.undoStack.push(command);

        this.editor.renderer.render();

    }

    clear() {

        this.undoStack.length = 0;

        this.redoStack.length = 0;

    }

}