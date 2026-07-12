import MoveNodeCommand from "../history/commands/MoveNodeCommand.js";


export default class Renderer {

    constructor(editor) {

        this.editor = editor;

        this.canvas = null;

        this.artboard = null;

        this.width = 0;

        this.height = 0;

    }

    initialize() {

        const canvasElement = this.editor.elements.canvas;

        this.canvas = new fabric.Canvas(canvasElement, {

            selection: true,
            preserveObjectStacking: true,
            stopContextMenu: true,
            fireRightClick: true,
            renderOnAddRemove: true

        });

        this.resize();

        this.createArtboard();

        this.bindEvents();

        console.log("✔ Renderer");

    }

    setBackground(color) {

        if (!this.canvas) return;

        this.canvas.backgroundColor = color;

        this.canvas.requestRenderAll();

    }

    bindEvents() {

        window.addEventListener("resize", () => {

            this.resize();


        });

        const canvas = this.canvas;

        const moveStart = new Map();

        canvas.on("mouse:down", (e) => {

            const tool = this.editor.tools.getActive();


            if (e.target) {

                return;

            }

            if (tool && tool.name !== "select" && tool.onMouseDown) {
                console.log("Active tool:", tool.name);
                tool.onMouseDown(e);

            }

        });

        canvas.on("mouse:move", (e) => {

            const tool = this.editor.tools.getActive();

            if (tool && tool.name !== "select" && tool.onMouseMove) {

                tool.onMouseMove(e.pointer);

            }

        });

        canvas.on("mouse:up", (e) => {

            const tool = this.editor.tools.getActive();

            if (tool && tool.name !== "select" && tool.onMouseUp) {

                tool.onMouseUp(e.pointer);

            }

        });

        canvas.on("mouse:dblclick", (e) => {

            const tool = this.editor.tools.getActive();

            if (tool && tool.onDoubleClick) {

                tool.onDoubleClick(e);

            }

        });

        canvas.on("object:moving", (e) => {

            const object = e.target;

            if (!object?.node) return;

            if (!moveStart.has(object.node.id)) {

                moveStart.set(

                    object.node.id,

                    structuredClone(object.node.transform)

                );

            }

        });

        canvas.on("object:modified", (e) => {

            const object = e.target;

            if (!object?.node) return;

            const node = object.node;

            const oldTransform = moveStart.get(node.id);

            const newTransform = {

                ...node.transform,

                x: object.left,
                y: object.top

            };

            this.editor.history.execute(

                new MoveNodeCommand(

                    node,

                    oldTransform,

                    newTransform

                )

            );

            moveStart.delete(node.id);

        });

    }

    createArtboard() {

        const artboard = this.editor.document.getActiveArtboard();

        if (!artboard) return;

        if (artboard.background.type === "transparent") {

            this.drawCheckerboard();

        }

        this.artboard = new fabric.Rect({

            left: 0,

            top: 0,

            width: artboard.width,

            height: artboard.height,

            fill: this.getArtboardFill(artboard),

            stroke: "#d0d0d0",

            strokeWidth: 1,

            shadow: new fabric.Shadow({

                color: "rgba(0,0,0,0.15)",

                blur: 20,

                offsetX: 0,

                offsetY: 4

            }),

            selectable: false,

            evented: false,

            excludeFromExport: true,

            lockMovementX: true,

            lockMovementY: true,

            lockRotation: true,

            lockScalingX: true,

            lockScalingY: true,

            lockSkewingX: true,

            lockSkewingY: true

        });

        this.artboard.node = artboard;

        this.canvas.add(this.artboard);

        this.centerArtboard();

    }

    drawCheckerboard() {

        // TODO

    }

    getArtboardFill(artboard) {

        switch (artboard.background.type) {

            case "transparent":

                return "transparent";

            case "solid":

                return artboard.background.color;

            case "gradient":

                return this.createGradient(artboard);

        }

    }

    createGradient(artboard) {

        // We'll implement this later.

        return "#ffffff";

    }
    centerArtboard() {

        if (!this.artboard) return;

        this.artboard.set({

            left: (this.width - this.artboard.width) / 2,

            top: (this.height - this.artboard.height) / 2

        });

    }

    resize() {

        const container = this.editor.elements.canvasContainer;

        this.width = container.clientWidth;

        this.height = container.clientHeight;

        this.canvas.setDimensions({

            width: this.width,

            height: this.height

        });

        if (this.artboard) {

            this.centerArtboard();

        }

        this.canvas.requestRenderAll();

    }

    renderDocument() {

        const objects = this.canvas.getObjects().slice();

        objects.forEach(object => {

            if (object !== this.artboard) {

                this.canvas.remove(object);

            }

        });

        this.editor.document.traverse(node => {

            switch (node.type) {

                case "rectangle":

                    this.drawRectangle(node);

                    break;

                case "ellipse":

                    this.drawEllipse(node);

                    break;

                case "text":

                    this.drawText(node);

                    break;

            }

        });

        this.canvas.requestRenderAll();

    }

    drawRectangle(node) {

        const rect = new fabric.Rect({

            left: node.transform.x,

            top: node.transform.y,

            width: node.transform.width,

            height: node.transform.height,

            fill: node.style.fill,

            stroke: node.style.stroke,

            strokeWidth: node.style.strokeWidth

        });

        rect.node = node;

        this.canvas.add(rect);

    }

    drawEllipse(node) {

        const ellipse = new fabric.Ellipse({

            left: node.transform.x,

            top: node.transform.y,

            rx: node.rx,

            ry: node.ry,

            fill: node.fill,

            stroke: node.stroke,

            strokeWidth: node.strokeWidth,

            originX: "left",

            originY: "top"

        });

        this.canvas.add(ellipse);

    }

    drawText(node) {

        const text = new fabric.IText(node.text, {

            left: node.transform.x,

            top: node.transform.y,

            fontSize: node.fontSize,

            fontFamily: node.fontFamily,

            fill: node.fill,

            fontWeight: node.fontWeight,

            fontStyle: node.fontStyle,

            textAlign: node.textAlign,

            lineHeight: node.lineHeight

        });

        this.canvas.add(text);

    }

    render() {

        console.log("Renderer.render()");
        console.log("Viewport background:", this.editor.viewport.workspace.background);

        this.editor.viewport.applyBackground();

        this.renderDocument();

    }

}