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

        super.activate();

        this.editor.renderer.canvas.selection = false;

    }

    onMouseDown(event) {

        // Don't start drawing if an existing object was clicked.
        if (event.target) {

            return;

        }

        const pointer = event.pointer;

        this.isDrawing = true;

        this.startX = pointer.x;
        this.startY = pointer.y;

        this.preview = new fabric.Rect({

            left: pointer.x,
            top: pointer.y,

            width: 1,
            height: 1,

            fill: fabric.Color
                .fromHex(this.editor.colors.fill)
                .setAlpha(0.3)
                .toRgba(),

            stroke: this.editor.colors.stroke,

            strokeWidth: this.editor.colors.strokeWidth,

            selectable: false,
            evented: false

        });

        this.editor.renderer.canvas.add(this.preview);

    }

    onMouseMove(pointer) {

        if (!this.isDrawing) return;

        const width = pointer.x - this.startX;
        const height = pointer.y - this.startY;

        this.preview.set({

            width: Math.abs(width),

            height: Math.abs(height),

            left: width >= 0 ? this.startX : pointer.x,

            top: height >= 0 ? this.startY : pointer.y

        });

        this.editor.renderer.canvas.requestRenderAll();

    }

    onMouseUp(pointer) {

        if (!this.isDrawing) return;

        this.isDrawing = false;

        this.editor.renderer.canvas.remove(this.preview);

        const width = this.preview.width;
        const height = this.preview.height;

        if (width < 2 || height < 2) {

            this.preview = null;

            return;

        }

        const node = new RectangleNode({

            x: this.preview.left,

            y: this.preview.top,

            width,

            height,

            fill: this.editor.colors.fill,

            stroke: this.editor.colors.stroke,

            strokeWidth: this.editor.colors.strokeWidth

        });

        this.editor.document.addNode(node);

        this.editor.renderer.render();

        this.preview = null;

    }

}