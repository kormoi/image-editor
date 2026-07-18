export default class Renderer {

    constructor(editor) {

        this.editor = editor;

        this.canvas = null;

        this.ctx = null;

        this.width = 0;

        this.height = 0;

    }

    initialize() {

        this.canvas = this.editor.elements.canvas;

        this.ctx = this.canvas.getContext("2d");

        this.resize();

        this.bindEvents();

        window.addEventListener(
            "resize",
            () => {

                this.resize();

                this.render();

            }
        );

        console.log("✔ Renderer");

    }

    bindEvents() {

        this.canvas.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );

        this.canvas.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this)
        );

        window.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this)
        );

    }

    hitTest(pointer) {

        const nodes = [];

        this.editor.document.traverse(node => {

            nodes.push(node);

        });

        // Top-most first
        nodes.reverse();

        for (const node of nodes) {

            if (!["rectangle", "ellipse"].includes(node.type)) {
                continue;
            }

            const t = node.transform;

            if (
                pointer.x >= t.x &&
                pointer.x <= t.x + t.width &&
                pointer.y >= t.y &&
                pointer.y <= t.y + t.height
            ) {

                return node;

            }

        }

        return null;

    }

    drawSelection() {

        const selected = this.editor.selection.getSelected();

        if (!selected || !selected.length) {

            return;

        }

        selected.forEach(node => {

            this.drawSelectionBox(node);

        });

    }

    drawSelectionBox(node) {

        const ctx =
            this.ctx;

        const t =
            node.transform;

        const centerX =
            t.x +
            t.width / 2;

        const centerY =
            t.y +
            t.height / 2;

        const rotation =
            (t.rotation ?? 0) *
            Math.PI /
            180;

        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.rotate(
            rotation
        );

        ctx.strokeStyle =
            "#000000";

        ctx.lineWidth =
            1;

        ctx.setLineDash([]);

        ctx.strokeRect(

            -t.width / 2,

            -t.height / 2,

            t.width,

            t.height

        );

        ctx.restore();

    }

    drawMarquee() {

        const tool = this.editor.tools.getActive();

        if (!tool?.marquee?.active) {

            return;

        }

        const x = Math.min(tool.marquee.start.x, tool.marquee.current.x);

        const y = Math.min(tool.marquee.start.y, tool.marquee.current.y);

        const w = Math.abs(tool.marquee.current.x - tool.marquee.start.x);

        const h = Math.abs(tool.marquee.current.y - tool.marquee.start.y);

        this.ctx.save();

        this.ctx.fillStyle = "rgba(74,141,255,.12)";

        this.ctx.strokeStyle = "#4A8DFF";

        this.ctx.lineWidth = 1;

        this.ctx.setLineDash([3, 3]);

        this.ctx.fillRect(x, y, w, h);

        this.ctx.strokeRect(x, y, w, h);

        this.ctx.restore();

    }

    onMouseDown(e) {

        const tool = this.editor.tools.getActive();

        if (!tool) return;

        tool.onMouseDown(this.getPointer(e), e);

    }

    onMouseMove(e) {

        const tool = this.editor.tools.getActive();

        if (!tool) return;

        tool.onMouseMove(this.getPointer(e), e);

    }

    onMouseUp(e) {

        const tool = this.editor.tools.getActive();

        if (!tool) return;

        tool.onMouseUp(this.getPointer(e), e);

    }

    getPointer(e) {

        const rect = this.canvas.getBoundingClientRect();

        return {

            x: e.clientX - rect.left,

            y: e.clientY - rect.top

        };

    }

    resize() {

        const container = this.editor.elements.canvasContainer;

        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.editor.initialized) {

            this.render();

        }

    }

    clear() {

        this.ctx.clearRect(

            0,
            0,
            this.width,
            this.height

        );

    }

    render() {

        this.clear();

        // Draw workspace background
        this.ctx.fillStyle = this.editor.viewport.workspace.background;

        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.drawArtboards();

        this.drawNodes();

        this.drawPreview();

        this.drawSelection();

        this.drawSelectionObjects();

        this.drawSelectionBounds();

        this.drawMarquee();

    }

    drawArtboards() {

        const ctx = this.ctx;

        const artboards = this.editor.document.getArtboards();

        artboards.forEach(artboard => {

            ctx.save();

            ctx.fillStyle = artboard.background.color || "#ffffff";

            ctx.strokeStyle = "#d0d0d0";

            ctx.lineWidth = 1;

            ctx.fillRect(
                artboard.x,
                artboard.y,
                artboard.width,
                artboard.height
            );

            ctx.strokeRect(
                artboard.x,
                artboard.y,
                artboard.width,
                artboard.height
            );

            ctx.restore();

        });

    }

    drawNodes() {

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

    }

    drawSelectionObjects() {
        this.editor.selection.getSelected().forEach(node => {
            this.drawSelectionBox(node);
        });
    }

    drawSelectionBounds() {
        const bounds = this.editor.selection.getBounds();

        if (!bounds) return;

        this.drawBounds(bounds);
        this.drawHandles(bounds);
    }

    drawBounds(bounds) {

        const ctx =
            this.ctx;

        const centerX =
            bounds.x +
            bounds.width / 2;

        const centerY =
            bounds.y +
            bounds.height / 2;

        const rotation =
            (bounds.rotation ?? 0) *
            Math.PI /
            180;

        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.rotate(
            rotation
        );

        ctx.strokeStyle =
            "#4A8DFF";

        ctx.lineWidth =
            1;

        ctx.setLineDash([
            5,
            5
        ]);

        ctx.strokeRect(

            -bounds.width / 2,

            -bounds.height / 2,

            bounds.width,

            bounds.height

        );

        ctx.restore();

    }

    drawHandles(bounds) {

        const ctx =
            this.ctx;

        const size =
            8;

        const centerX =
            bounds.x +
            bounds.width / 2;

        const centerY =
            bounds.y +
            bounds.height / 2;

        const rotation =
            (bounds.rotation ?? 0) *
            Math.PI /
            180;

        const cos =
            Math.cos(rotation);

        const sin =
            Math.sin(rotation);

        const rotatePoint =
            (x, y) => {

                const dx =
                    x - centerX;

                const dy =
                    y - centerY;

                return {

                    x:
                        centerX +
                        dx * cos -
                        dy * sin,

                    y:
                        centerY +
                        dx * sin +
                        dy * cos

                };

            };

        const points = [

            [
                bounds.x,
                bounds.y
            ],

            [
                centerX,
                bounds.y
            ],

            [
                bounds.x +
                bounds.width,

                bounds.y
            ],

            [

                bounds.x,

                centerY

            ],

            [

                bounds.x +
                bounds.width,

                centerY

            ],

            [

                bounds.x,

                bounds.y +
                bounds.height

            ],

            [

                centerX,

                bounds.y +
                bounds.height

            ],

            [

                bounds.x +
                bounds.width,

                bounds.y +
                bounds.height

            ]

        ];

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.strokeStyle =
            "#4A8DFF";

        ctx.lineWidth =
            1;

        points.forEach(
            ([x, y]) => {

                const point =
                    rotatePoint(
                        x,
                        y
                    );

                ctx.beginPath();

                ctx.rect(

                    point.x -
                    size / 2,

                    point.y -
                    size / 2,

                    size,

                    size

                );

                ctx.fill();

                ctx.stroke();

            }
        );

        ctx.restore();

    }

    drawPreview() {

        if (!this.editor.tools) return;

        const tool = this.editor.tools.getActive();

        if (!tool) return;

        if (!tool.preview) return;

        switch (tool.preview.type) {

            case "rectangle":

                this.drawRectangle(tool.preview);

                break;

            case "ellipse":

                this.drawEllipse(tool.preview);

                break;
        }

    }

    drawRectangle(rectangle) {

        const ctx = this.ctx;

        const x =
            rectangle.transform
                ? rectangle.transform.x
                : rectangle.x;

        const y =
            rectangle.transform
                ? rectangle.transform.y
                : rectangle.y;

        const width =
            rectangle.transform
                ? rectangle.transform.width
                : rectangle.width;

        const height =
            rectangle.transform
                ? rectangle.transform.height
                : rectangle.height;

        const rotation =
            rectangle.transform
                ? rectangle.transform.rotation ?? 0
                : rectangle.rotation ?? 0;

        const fill =
            rectangle.style
                ? rectangle.style.fill
                : rectangle.fill;

        const stroke =
            rectangle.style
                ? rectangle.style.stroke
                : rectangle.stroke;

        const strokeWidth =
            rectangle.style
                ? rectangle.style.strokeWidth
                : rectangle.strokeWidth;

        ctx.save();

        //
        // Move origin to rectangle center
        //

        ctx.translate(
            x + width / 2,
            y + height / 2
        );

        //
        // Rotate degrees → radians
        //

        ctx.rotate(
            rotation *
            Math.PI /
            180
        );

        ctx.beginPath();

        //
        // Draw around the center
        //

        ctx.rect(
            -width / 2,
            -height / 2,
            width,
            height
        );

        if (fill) {

            ctx.fillStyle =
                fill;

            ctx.fill();

        }

        if (
            strokeWidth > 0
        ) {

            ctx.lineWidth =
                strokeWidth;

            ctx.strokeStyle =
                stroke;

            ctx.stroke();

        }

        ctx.restore();

    }

    drawEllipse(ellipse) {

        const ctx =
            this.ctx;

        const t =
            ellipse.transform;

        const rotation =
            t.rotation ?? 0;

        ctx.save();

        //
        // Move origin to ellipse center
        //

        ctx.translate(

            t.x + t.width / 2,

            t.y + t.height / 2

        );

        //
        // Rotate degrees → radians
        //

        ctx.rotate(

            rotation *
            Math.PI /
            180

        );

        ctx.beginPath();

        ctx.ellipse(

            0,

            0,

            t.width / 2,

            t.height / 2,

            0,

            0,

            Math.PI * 2

        );

        if (
            ellipse.style.fill
        ) {

            ctx.fillStyle =
                ellipse.style.fill;

            ctx.fill();

        }

        if (
            ellipse.style.strokeWidth > 0
        ) {

            ctx.lineWidth =
                ellipse.style.strokeWidth;

            ctx.strokeStyle =
                ellipse.style.stroke;

            ctx.stroke();

        }

        ctx.restore();

    }

}