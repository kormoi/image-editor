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

        canvas.addEventListener("wheel", (e) => {

            e.preventDefault();

            const factor = e.deltaY < 0 ? 1.1 : 0.9;

            this.zoom *= factor;

            this.zoom = Math.max(
                this.minZoom,
                Math.min(this.maxZoom, this.zoom)
            );

            this.editor.renderer.render();

        }, { passive: false });

    }


    applyBackground() {

        // Nothing here for now.

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