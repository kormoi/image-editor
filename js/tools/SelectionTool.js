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

        //
        // Start resizing
        //

        const handle =
            this.hitTestHandle(
                pointer
            );

        if (
            handle
        ) {

            this.beginResize(
                handle,
                pointer
            );

            return;

        }

        //
        // Start rotating
        //

        const rotationCorner =
            this.hitTestRotationCorner(
                pointer
            );

        if (
            rotationCorner
        ) {

            this.beginRotate(
                rotationCorner,
                pointer
            );

            return;

        }

        //
        // Hit test object
        //

        const node =
            this.editor.renderer.hitTest(
                pointer
            );

        if (
            !node
        ) {

            this.dragging =
                false;

            this.marquee.active =
                true;

            this.marquee.start =
                pointer;

            this.marquee.current =
                pointer;

            this.dragItems =
                [];

            this.lastPointer =
                null;

            return;

        }

        const selected =
            this.editor.selection
                .getSelected();

        if (
            event.shiftKey
        ) {

            this.editor.selection
                .toggle(
                    node
                );

            this.editor.panels
                .updateAll();

        } else {

            if (
                !selected.includes(
                    node
                )
            ) {

                this.editor.selection
                    .select(
                        node
                    );

                this.editor.panels
                    .updateAll();

            }

        }

        //
        // Start dragging
        //

        this.dragging =
            true;

        this.lastPointer = {

            x:
                pointer.x,

            y:
                pointer.y

        };

        this.dragItems =
            this.editor.selection
                .getSelected()
                .map(
                    node => ({

                        node,

                        startX:
                            node.transform.x,

                        startY:
                            node.transform.y

                    })
                );

        this.editor.renderer.render();

    }

    onMouseMove(pointer, event) {

        //
        // Marquee
        //

        if (this.marquee.active) {

            this.marquee.current = pointer;

            this.editor.renderer.render();

            return;

        }

        //
        // Active resize
        //

        if (this.resizing) {

            this.resize(pointer);

            return;

        }

        //
        // Active rotation
        //

        if (this.rotating) {

            this.rotate(pointer);

            return;

        }

        //
        // Resize handle hover
        //

        const handle =
            this.hitTestHandle(pointer);

        if (handle) {

            switch (handle.name) {

                case "topLeft":
                case "bottomRight":

                    this.editor.elements.canvas.style.cursor =
                        "nwse-resize";

                    break;

                case "topRight":
                case "bottomLeft":

                    this.editor.elements.canvas.style.cursor =
                        "nesw-resize";

                    break;

                case "left":
                case "right":

                    this.editor.elements.canvas.style.cursor =
                        "ew-resize";

                    break;

                case "top":
                case "bottom":

                    this.editor.elements.canvas.style.cursor =
                        "ns-resize";

                    break;

            }

            return;

        }

        //
        // Rotation hover
        //

        const rotationCorner =
            this.hitTestRotationCorner(pointer);

        if (rotationCorner) {

            this.editor.elements.canvas.style.cursor =
                'url("/assets/cursors/rotate-left.svg") 16 16, auto';

            return;

        }

        //
        // Default cursor
        //

        this.editor.elements.canvas.style.cursor =
            "default";

        //
        // Move selected objects
        //

        if (!this.dragging) {

            return;

        }

        const dx =
            pointer.x -
            this.lastPointer.x;

        const dy =
            pointer.y -
            this.lastPointer.y;

        this.editor.selection
            .getSelected()
            .forEach(node => {

                node.transform.x += dx;

                node.transform.y += dy;

            });

        this.lastPointer = {

            x: pointer.x,

            y: pointer.y

        };

        this.editor.renderer.render();

        this.editor.panels.updateAll();

    }

    onMouseUp(pointer, event) {

        //
        // Finish marquee
        //

        if (
            this.marquee.active
        ) {

            this.finishMarquee(
                event
            );

            this.marquee.active =
                false;

            this.editor.renderer.render();

            return;

        }

        //
        // Finish resizing
        //

        if (
            this.resizing
        ) {

            this.resizing =
                false;

            this.resizeSession =
                null;

            this.editor.panels
                .updateAll();

            return;

        }

        //
        // Finish rotating
        //

        if (
            this.rotating
        ) {

            this.rotating =
                false;

            this.rotationSession =
                null;

            this.editor.panels
                .updateAll();

            return;

        }

        //
        // Finish dragging
        //

        this.dragging =
            false;

        this.dragItems =
            [];

        this.lastPointer =
            null;

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

            if (!["rectangle", "ellipse"].includes(node.type)) {
                return;
            }

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

        const bounds =
            this.editor.selection
                .getBounds();

        if (!bounds) {

            return null;

        }

        const handles = [

            {
                name: "topLeft",
                x: bounds.x,
                y: bounds.y
            },

            {
                name: "top",
                x: bounds.x +
                    bounds.width / 2,
                y: bounds.y
            },

            {
                name: "topRight",
                x: bounds.x +
                    bounds.width,
                y: bounds.y
            },

            {
                name: "left",
                x: bounds.x,
                y: bounds.y +
                    bounds.height / 2
            },

            {
                name: "right",
                x: bounds.x +
                    bounds.width,
                y: bounds.y +
                    bounds.height / 2
            },

            {
                name: "bottomLeft",
                x: bounds.x,
                y: bounds.y +
                    bounds.height
            },

            {
                name: "bottom",
                x: bounds.x +
                    bounds.width / 2,
                y: bounds.y +
                    bounds.height
            },

            {
                name: "bottomRight",
                x: bounds.x +
                    bounds.width,
                y: bounds.y +
                    bounds.height
            }

        ];

        for (
            const handle
            of handles
        ) {

            const distance =
                Math.hypot(

                    pointer.x -
                    handle.x,

                    pointer.y -
                    handle.y

                );

            if (
                distance <= 6
            ) {

                return handle;

            }

        }

        return null;

    }

    hitTestRotationCorner(pointer) {

        const selected =
            this.editor.selection
                .getSelected();

        if (
            selected.length !== 1
        ) {

            return null;

        }

        const node =
            selected[0];

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

        const cos =
            Math.cos(rotation);

        const sin =
            Math.sin(rotation);

        const corners = [

            {
                name: "topLeft",
                x: t.x,
                y: t.y
            },

            {
                name: "topRight",
                x: t.x + t.width,
                y: t.y
            },

            {
                name: "bottomRight",
                x: t.x + t.width,
                y: t.y + t.height
            },

            {
                name: "bottomLeft",
                x: t.x,
                y: t.y + t.height
            }

        ];

        for (
            const corner
            of corners
        ) {

            const dx =
                corner.x -
                centerX;

            const dy =
                corner.y -
                centerY;

            const x =
                centerX +
                dx * cos -
                dy * sin;

            const y =
                centerY +
                dx * sin +
                dy * cos;

            const distance =
                Math.hypot(

                    pointer.x - x,

                    pointer.y - y

                );

            if (
                distance > 4 &&
                distance <= 15
            ) {

                return {

                    name:
                        corner.name,

                    x,

                    y

                };

            }

        }

        return null;

    }

    getRotationCursor(corner) {

        switch (
        corner.name
        ) {

            case "topLeft":
            case "bottomRight":

                return "nesw-resize";

            case "topRight":
            case "bottomLeft":

                return "nwse-resize";

            default:

                return "default";

        }

    }

    beginResize(handle, pointer) {

        this.resizing = true;

        const bounds = this.editor.selection.getBounds();

        this.resizeSession = {

            handle: handle.name,

            startPointer: {

                x: pointer.x,

                y: pointer.y

            },

            startBounds: structuredClone(bounds),

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

        const dx =
            pointer.x -
            session.startPointer.x;

        const dy =
            pointer.y -
            session.startPointer.y;

        //
        // Start with the original four edges
        //

        let left = old.x;

        let right = old.x + old.width;

        let top = old.y;

        let bottom = old.y + old.height;

        //
        // Move the selected edge
        //

        switch (session.handle) {

            case "left":

                left += dx;

                break;

            case "right":

                right += dx;

                break;

            case "top":

                top += dy;

                break;

            case "bottom":

                bottom += dy;

                break;

            case "topLeft":

                left += dx;

                top += dy;

                break;

            case "topRight":

                right += dx;

                top += dy;

                break;

            case "bottomLeft":

                left += dx;

                bottom += dy;

                break;

            case "bottomRight":

                right += dx;

                bottom += dy;

                break;

        }

        //
        // Normalize crossed edges
        //

        const newBounds = {

            x: Math.min(left, right),

            y: Math.min(top, bottom),

            width: Math.abs(right - left),

            height: Math.abs(bottom - top)

        };

        //
        // Prevent zero-size objects
        //

        newBounds.width =
            Math.max(1, newBounds.width);

        newBounds.height =
            Math.max(1, newBounds.height);

        //
        // Calculate scale relative to the original selection
        //

        const scaleX =
            newBounds.width /
            old.width;

        const scaleY =
            newBounds.height /
            old.height;

        //
        // Scale every selected node
        //

        session.items.forEach(item => {

            const node = item.node;

            const t = item.transform;

            const relativeX =
                t.x - old.x;

            const relativeY =
                t.y - old.y;

            node.transform.x =
                newBounds.x +
                relativeX * scaleX;

            node.transform.y =
                newBounds.y +
                relativeY * scaleY;

            node.transform.width =
                t.width * scaleX;

            node.transform.height =
                t.height * scaleY;

        });

        this.editor.renderer.render();

        this.editor.panels.updateAll();

    }

    beginRotate(
        corner,
        pointer
    ) {

        const selected =
            this.editor.selection
                .getSelected();

        if (
            selected.length !== 1
        ) {

            return;

        }

        const node =
            selected[0];

        const t =
            node.transform;

        const centerX =
            t.x +
            t.width / 2;

        const centerY =
            t.y +
            t.height / 2;

        const startAngle =
            Math.atan2(

                pointer.y -
                centerY,

                pointer.x -
                centerX

            );

        this.rotating =
            true;

        this.rotationSession = {

            node,

            centerX,

            centerY,

            startAngle,

            startRotation:
                t.rotation ?? 0

        };

    }

    rotate(
        pointer
    ) {

        if (
            !this.rotating ||
            !this.rotationSession
        ) {

            return;

        }

        const session =
            this.rotationSession;

        const currentAngle =
            Math.atan2(

                pointer.y -
                session.centerY,

                pointer.x -
                session.centerX

            );

        let deltaAngle =
            currentAngle -
            session.startAngle;

        if (
            deltaAngle > Math.PI
        ) {

            deltaAngle -=
                Math.PI * 2;

        }

        if (
            deltaAngle < -Math.PI
        ) {

            deltaAngle +=
                Math.PI * 2;

        }

        session.node
            .transform
            .rotation =

            session.startRotation +

            deltaAngle *
            180 /
            Math.PI;

        this.editor.renderer.render();

        this.editor.panels.updateAll();

    }

}