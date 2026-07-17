import Tool from "./Tool.js";

export default class SelectionTool extends Tool {

    constructor(editor) {

        super(editor);

        this.name = "select";

        this.cursor = "default";

        this.marquee = {
            active: false,
            start: null,
            current: null
        };

        this.dragging = false;

        this.dragItems = [];

        this.startPointer = null;

    }

    activate() {

        super.activate();

    }

    onMouseDown(pointer, event) {

        // Start resizing

        const handle = this.hitTestHandle(pointer);

        if (handle) {

            this.beginResize(handle, pointer);

            return;

        }

        const node = this.editor.renderer.hitTest(pointer);

        if (!node) {

            this.dragging = false;

            this.marquee.active = true;

            this.marquee.start = pointer;

            this.marquee.current = pointer;

            this.dragItems = [];

            this.lastPointer = null;

            return;

        }

        const selected = this.editor.selection.getSelected();

        if (event.shiftKey) {

            this.editor.selection.toggle(node);

        } else {

            if (!selected.includes(node)) {

                this.editor.selection.select(node);

            }

            // else:
            // already selected
            // keep the whole selection
        }

        // Start dragging
        this.dragging = true;

        this.lastPointer = {

            x: pointer.x,

            y: pointer.y

        };

        this.dragItems = this.editor.selection.getSelected().map(node => ({

            node,

            startX: node.transform.x,

            startY: node.transform.y

        }));

        this.editor.renderer.render();

    }

    onMouseMove(pointer, event) {

        //
        // Update marquee first
        //

        if (this.marquee.active) {

            this.marquee.current = pointer;

            this.editor.renderer.render();

            return;

        }

        //
        // Scale Selected object
        //

        const handle = this.hitTestHandle(pointer);

        if (this.resizing) {

            this.resize(pointer);

            return;

        }

        if (handle) {

            switch (handle.name) {

                case "topLeft":
                case "bottomRight":
                    this.editor.elements.canvas.style.cursor = "nwse-resize";
                    break;

                case "topRight":
                case "bottomLeft":
                    this.editor.elements.canvas.style.cursor = "nesw-resize";
                    break;

                case "left":
                case "right":
                    this.editor.elements.canvas.style.cursor = "ew-resize";
                    break;

                case "top":
                case "bottom":
                    this.editor.elements.canvas.style.cursor = "ns-resize";
                    break;

            }

        } else {

            this.editor.elements.canvas.style.cursor = "default";

        }

        //
        // Move selected objects
        //

        if (!this.dragging) {

            return;

        }

        const dx = pointer.x - this.lastPointer.x;

        const dy = pointer.y - this.lastPointer.y;

        this.editor.selection.getSelected().forEach(node => {

            node.transform.x += dx;

            node.transform.y += dy;

        });


        this.lastPointer = {

            x: pointer.x,

            y: pointer.y

        };

        this.editor.renderer.render();

    }

    onMouseUp(pointer, event) {

        //
        // Finish marquee
        //

        if (this.marquee.active) {

            this.finishMarquee(event);

            this.marquee.active = false;

            this.editor.renderer.render();

            return;

        }


        //
        // Finish Scalling
        //

        if (this.resizing) {

            this.resizing = false;

            this.resizeSession = null;

            return;

        }

        //
        // Finish dragging
        //

        this.dragging = false;

        this.dragItems = [];

        this.lastPointer = null;

    }

    finishMarquee(event) {

        const x1 = Math.min(
            this.marquee.start.x,
            this.marquee.current.x
        );

        const y1 = Math.min(
            this.marquee.start.y,
            this.marquee.current.y
        );

        const x2 = Math.max(
            this.marquee.start.x,
            this.marquee.current.x
        );

        const y2 = Math.max(
            this.marquee.start.y,
            this.marquee.current.y
        );

        if (!event.shiftKey) {

            this.editor.selection.clear();

        }

        this.editor.document.traverse(node => {

            if (node.type !== "rectangle") return;

            const t = node.transform;

            if (

                !(

                    x2 < t.x ||

                    x1 > t.x + t.width ||

                    y2 < t.y ||

                    y1 > t.y + t.height

                )

            ) {

                this.editor.selection.add(node);

            }

        });

    }

    hitTestHandle(pointer) {

        const bounds = this.editor.selection.getBounds();

        if (!bounds) {

            return null;

        }

        const size = 8;

        const half = size / 2;

        const handles = {

            topLeft: {
                x: bounds.x,
                y: bounds.y
            },

            top: {
                x: bounds.x + bounds.width / 2,
                y: bounds.y
            },

            topRight: {
                x: bounds.x + bounds.width,
                y: bounds.y
            },

            left: {
                x: bounds.x,
                y: bounds.y + bounds.height / 2
            },

            right: {
                x: bounds.x + bounds.width,
                y: bounds.y + bounds.height / 2
            },

            bottomLeft: {
                x: bounds.x,
                y: bounds.y + bounds.height
            },

            bottom: {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height
            },

            bottomRight: {
                x: bounds.x + bounds.width,
                y: bounds.y + bounds.height
            }

        };

        for (const [name, point] of Object.entries(handles)) {

            if (

                pointer.x >= point.x - half &&
                pointer.x <= point.x + half &&
                pointer.y >= point.y - half &&
                pointer.y <= point.y + half

            ) {

                return {

                    name,

                    x: point.x,

                    y: point.y

                };

            }

        }

        return null;

    }

    beginResize(handle, pointer) {

        this.resizing = true;

        this.resizeSession = {

            handle: handle.name,

            startPointer: {

                x: pointer.x,

                y: pointer.y

            },

            startBounds: structuredClone(
                this.editor.selection.getBounds()
            ),

            items: this.editor.selection.getSelected().map(node => ({

                node,

                transform: structuredClone(node.transform)

            }))

        };

    }

    resize(pointer) {

        if (!this.resizing) {

            return;

        }

        const session = this.resizeSession;

        const old = session.startBounds;
        const newBounds = {

            x: old.x,
            y: old.y,
            width: old.width,
            height: old.height

        };


        const dx = pointer.x - session.startPointer.x;
        const dy = pointer.y - session.startPointer.y;

        switch (session.handle) {

            case "right":

                newBounds.width += dx;
                break;

            case "left":

                newBounds.x += dx;
                newBounds.width -= dx;
                break;

            case "bottom":

                newBounds.height += dy;
                break;

            case "top":

                newBounds.y += dy;
                newBounds.height -= dy;
                break;

            case "topLeft":

                newBounds.x += dx;
                newBounds.y += dy;

                newBounds.width -= dx;
                newBounds.height -= dy;
                break;

            case "topRight":

                newBounds.y += dy;

                newBounds.width += dx;
                newBounds.height -= dy;
                break;

            case "bottomRight":

                newBounds.width += dx;
                newBounds.height += dy;
                break;

            case "bottomLeft":

                newBounds.x += dx;

                newBounds.width -= dx;
                newBounds.height += dy;
                break;

        }

        newBounds.width = Math.max(1, newBounds.width);
        newBounds.height = Math.max(1, newBounds.height);

        const scaleX = newBounds.width / old.width;
        const scaleY = newBounds.height / old.height;

        session.items.forEach(item => {

            const node = item.node;

            const t = item.transform;

            const rx = t.x - old.x;
            const ry = t.y - old.y;

            node.transform.x = newBounds.x + rx * scaleX;
            node.transform.y = newBounds.y + ry * scaleY;

            node.transform.width = t.width * scaleX;
            node.transform.height = t.height * scaleY;

        });

        this.editor.renderer.render();

    }

}