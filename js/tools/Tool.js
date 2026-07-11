export default class Tool {

    constructor(editor) {

        this.editor = editor;

        this.name = "tool";

        this.cursor = "default";

        this.active = false;

    }

    activate() {

        this.active = true;

        this.setCursor(this.cursor);

        console.log(`${this.name} activated`);

    }

    deactivate() {

        this.active = false;

    }

    setCursor(cursor) {

        const canvas = this.editor.renderer?.canvas;

        if (!canvas) return;

        canvas.defaultCursor = cursor;

    }

    onMouseDown(event) {}

    onMouseMove(event) {}

    onMouseUp(event) {}

    onDoubleClick(event) {}

    onKeyDown(event) {}

    onKeyUp(event) {}

    onWheel(event) {}

    cancel() {}

}