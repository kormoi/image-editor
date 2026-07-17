import Tool from "./Tool.js";
import RectangleNode from "../nodes/RectangleNode.js";

export default class RectangleTool extends Tool {

    constructor(editor) {

        super(editor);

        this.name = "rectangle";
        this.cursor = "crosshair";

        this.isDrawing = false;

        this.startX = 0;
        this.startY = 0;

        this.preview = null;

    }

    activate() {

        this.active = true;

        this.editor.renderer.canvas.style.cursor = this.cursor;

    }

    deactivate() {

        this.active = false;

        this.editor.renderer.canvas.style.cursor = "default";

    }

    onMouseDown(event) {

        if (event.target) return;

        this.isDrawing = true;

        this.startX = event.x;
        this.startY = event.y;

        this.preview = {

            type: "rectangle",

            x: this.startX,

            y: this.startY,

            width: 0,

            height: 0,

            fill: this.editor.colors.fill,

            stroke: this.editor.colors.stroke,

            strokeWidth: this.editor.colors.strokeWidth

        };

        this.editor.renderer.render();

    }

    onMouseMove(pointer, event) {

        if (!this.isDrawing) return;

        let width = pointer.x - this.startX;
        let height = pointer.y - this.startY;

        if (event.shiftKey) {
            
            const size = Math.max(width, height);

            width = size;
            height = size;

        }

        this.preview.width = width;
        this.preview.height = height;

        this.editor.renderer.render();

    }

    onMouseUp() {

        if (!this.isDrawing) return;

        this.isDrawing = false;

        if (
            Math.abs(this.preview.width) < 2 ||
            Math.abs(this.preview.height) < 2
        ) {

            this.preview = null;

            this.editor.renderer.render();

            return;

        }

        let x = this.preview.x;
        let y = this.preview.y;

        let width = this.preview.width;
        let height = this.preview.height;

        if (width < 0) {

            x += width;
            width = Math.abs(width);

        }

        if (height < 0) {

            y += height;
            height = Math.abs(height);

        }

        const node = new RectangleNode({

            x,
            y,
            width,
            height,

            fill: this.preview.fill,
            stroke: this.preview.stroke,
            strokeWidth: this.preview.strokeWidth

        });

        this.editor.document.addNode(node);

        console.log(this.editor.document.getMart());

        this.preview = null;

        this.editor.renderer.render();

    }

}