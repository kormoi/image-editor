import Tool from "./Tool.js";
import EllipseNode from "../nodes/EllipseNode.js";

export default class EllipseTool extends Tool {

    constructor(editor) {

        super(editor);

        this.name = "ellipse";

        this.cursor = "crosshair";

        this.drawing = false;

        this.start = null;

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

    onMouseDown(pointer) {

        this.drawing = true;

        this.start = pointer;

        this.preview = {

            type: "ellipse",

            transform: {

                x: pointer.x,
                y: pointer.y,

                width: 0,
                height: 0

            },

            style: {

                fill: this.editor.colors.fill,

                stroke: this.editor.colors.stroke,

                strokeWidth: 1

            }

        };

    }

    onMouseMove(pointer, event) {

        if (!this.drawing) return;

        let width = Math.abs(pointer.x - this.start.x);
        let height = Math.abs(pointer.y - this.start.y);

        if (event.shiftKey) {

            const size = Math.max(width, height);

            width = size;
            height = size;

        }

        this.preview.transform.width = width;
        this.preview.transform.height = height;

        this.preview.transform.x =
            pointer.x >= this.start.x
                ? this.start.x
                : this.start.x - width;

        this.preview.transform.y =
            pointer.y >= this.start.y
                ? this.start.y
                : this.start.y - height;

        this.editor.renderer.render();

    }

    onMouseUp() {

        if (!this.drawing) return;

        this.drawing = false;

        //
        // Ignore tiny ellipses
        //

        if (

            Math.abs(this.preview.transform.width) < 2 ||
            Math.abs(this.preview.transform.height) < 2

        ) {

            this.preview = null;

            this.editor.renderer.render();

            return;

        }

        let x = this.preview.transform.x;
        let y = this.preview.transform.y;

        let width = this.preview.transform.width;
        let height = this.preview.transform.height;

        //
        // Normalize negative dragging
        //

        if (width < 0) {

            x += width;
            width = Math.abs(width);

        }

        if (height < 0) {

            y += height;
            height = Math.abs(height);

        }

        const node = new EllipseNode({

            x,
            y,
            width,
            height,

            fill: this.preview.style.fill,
            stroke: this.preview.style.stroke,
            strokeWidth: this.preview.style.strokeWidth

        });

        this.editor.document.addNode(node);

        console.log(this.editor.document.getMart());

        this.preview = null;

        this.editor.renderer.render();

    }

}