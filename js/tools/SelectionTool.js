import Tool from "./Tool.js";

export default class SelectionTool extends Tool {

    constructor(editor) {

        super(editor);

        this.name = "select";

        this.cursor = "default";

    }

    activate() {

        super.activate();

        const canvas = this.editor.renderer.canvas;

        canvas.selection = true;

        canvas.defaultCursor = "default";

        canvas.forEachObject(object => {

            // Never select the artboard
            if (object === this.editor.renderer.artboard) {

                object.selectable = false;
                object.evented = false;

                return;

            }

            object.selectable = true;
            object.evented = true;

        });

        canvas.requestRenderAll();

    }

    deactivate() {

        super.deactivate();

        const canvas = this.editor.renderer.canvas;

        canvas.discardActiveObject();

        canvas.requestRenderAll();

    }

    onMouseDown(event) {

    }

    onMouseMove(event) {

    }

    onMouseUp(event) {

    }

}