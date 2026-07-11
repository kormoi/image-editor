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

    bindEvents() {

        window.addEventListener("resize", () => {

            this.resize();


        });

        const canvas = this.canvas;
        
        let moveStart = null;

        canvas.on("mouse:down", (e) => {

            const tool = this.editor.tools.getActive();

            if (tool && tool.name !== "select" && tool.onMouseDown) {

                tool.onMouseDown(e.pointer);

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

            if (!object?.node) {

                return;

            }

            if (!moveStart) {

                moveStart = {

                    ...object.node.transform

                };

            }

        });

        canvas.on("object:modified", (e) => {

            const object = e.target;

            if (!object?.node) {

                return;

            }

            const node = object.node;

            const newTransform = {

                ...node.transform,

                x: object.left,

                y: object.top

            };

            this.editor.history.execute(

                new MoveNodeCommand(

                    node,

                    moveStart,

                    newTransform

                )

            );

            moveStart = null;

        });

    }

    createArtboard() {

        const artboard = this.editor.document.getActiveArtboard();

        if (!artboard) return;

        this.artboard = new fabric.Rect({

            left: 0,

            top: 0,

            width: artboard.width,

            height: artboard.height,

            fill: artboard.background,

            stroke: "#d0d0d0",

            strokeWidth: 1,

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

        this.canvas.add(this.artboard);

        this.centerArtboard();

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

        this.centerArtboard();

        this.canvas.requestRenderAll();

    }

    renderDocument() {

        this.canvas.clear();

        this.createArtboard();

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

        rect.hasControls = true;

        rect.hasBorders = true;

        rect.objectCaching = false;

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

        this.renderDocument();

    }

}