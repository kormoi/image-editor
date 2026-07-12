export default class Viewport {

    constructor(editor) {

        this.editor = editor;

        this.zoom = 1;

        this.offsetX = 0;

        this.offsetY = 0;

        this.minZoom = 0.05;

        this.maxZoom = 32;

        this.workspace = {

            theme: "light",

            background: "#f3f3f3",

            grid: {

                enabled: true,

                type: "dots",

                spacing: 20,

                color: "#d9d9d9"

            }

        };

    }

    initialize() {

        this.applyBackground();

        this.bindEvents();

    }


    bindEvents() {

        const canvas = this.editor.renderer.canvas;

        canvas.on("mouse:wheel", (event) => {

            const e = event.e;

            let zoom = canvas.getZoom();

            zoom *= Math.pow(0.999, e.deltaY);

            zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));

            canvas.zoomToPoint(

                new fabric.Point(e.offsetX, e.offsetY),

                zoom

            );

            this.zoom = zoom;

            e.preventDefault();

            e.stopPropagation();

        });

    }


    applyBackground() {

        console.log("Editor:", this.editor);

        console.log("Renderer:", this.editor.renderer);

        console.log("Canvas:", this.editor.renderer?.canvas);

        this.editor.renderer.setBackground(

            this.workspace.background

        );

    }

    centerArtboard() {

        const renderer = this.editor.renderer;

        if (!renderer.artboard) {

            return;

        }

        renderer.artboard.set({

            left: (renderer.width - renderer.artboard.width) / 2,

            top: (renderer.height - renderer.artboard.height) / 2

        });

    }

}