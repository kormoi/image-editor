export default class ToolbarManager {

    constructor(editor) {

        this.editor = editor;

        this.toolbar = document.getElementById("toolbar");

        this.workspace = document.getElementById("workspace");

        this.handle = document.getElementById("toolbar-handle");

        this.dragging = false;

        this.offsetX = 0;

        this.offsetY = 0;

        this.points = [];

    }

    initialize() {

        this.updateDockPoints();

        this.toolbar.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );

        window.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this)
        );

        window.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this)
        );

    }
    updateDockPoints() {

        const workspace = this.workspace.getBoundingClientRect();

        this.points = [

            {
                name: "top-left",
                x: 20,
                y: 20,
                anchor: "top"
            },

            {
                name: "top-right",
                x: workspace.width - 20,
                y: 20,
                anchor: "top"
            },

            {
                name: "left-middle",
                x: 20,
                y: workspace.height / 2,
                anchor: "middle"
            },

            {
                name: "right-middle",
                x: workspace.width - 20,
                y: workspace.height / 2,
                anchor: "middle"
            },

            {
                name: "bottom-left",
                x: 20,
                y: workspace.height - 20,
                anchor: "bottom"
            },

            {
                name: "bottom-right",
                x: workspace.width - 20,
                y: workspace.height - 20,
                anchor: "bottom"
            }

        ];

    }

    findNearestDock() {

        const a = this.getToolbarAnchors();

        let nearest = null;

        let best = Infinity;

        for (const point of this.points) {

            let d;

            switch (point.anchor) {

                case "top":

                    d = Math.hypot(
                        a.middleX - point.x,
                        a.top - point.y
                    );

                    break;

                case "middle":

                    d = Math.hypot(
                        a.middleX - point.x,
                        a.middleY - point.y
                    );

                    break;

                case "bottom":

                    d = Math.hypot(
                        a.middleX - point.x,
                        a.bottom - point.y
                    );

                    break;

            }

            if (d < best) {

                best = d;

                nearest = point;

            }

        }

        return nearest;

    }

    getToolbarAnchors() {

        const workspace = this.workspace.getBoundingClientRect();

        const rect = this.toolbar.getBoundingClientRect();

        return {

            left: rect.left - workspace.left,

            right: rect.right - workspace.left,

            top: rect.top - workspace.top,

            bottom: rect.bottom - workspace.top,

            middleX:
                rect.left - workspace.left +
                rect.width / 2,

            middleY:
                rect.top - workspace.top +
                rect.height / 2

        };

    }

    onMouseDown(e) {

        // Don't drag if the user clicked a control.
        if (
            e.target.closest("button") ||
            e.target.closest("input") ||
            e.target.closest("textarea") ||
            e.target.closest("select") ||
            e.target.closest("label") ||
            e.target.closest("a")
        ) {
            return;
        }

        e.preventDefault();

        const workspace = this.workspace.getBoundingClientRect();

        const rect = this.toolbar.getBoundingClientRect();

        this.toolbar.style.left =
            `${rect.left - workspace.left}px`;

        this.toolbar.style.top =
            `${rect.top - workspace.top}px`;

        // Remove all dock classes
        this.toolbar.classList.remove(
            "top-left",
            "top-right",
            "left-middle",
            "right-middle",
            "bottom-left",
            "bottom-right"
        );

        this.toolbar.classList.add("dragging");

        this.dragging = true;

        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
    }

    onMouseMove(e) {

        if (!this.dragging) return;

        const workspace = this.workspace.getBoundingClientRect();

        this.toolbar.style.left =
            `${e.clientX - workspace.left - this.offsetX}px`;

        this.toolbar.style.top =
            `${e.clientY - workspace.top - this.offsetY}px`;

    }

    onMouseUp() {

        this.dragging = false;

        const dock = this.findNearestDock();

        if (dock) {

            this.toolbar.style.left = "";
            this.toolbar.style.top = "";

            this.toolbar.classList.remove("dragging");

            this.toolbar.classList.add(dock.name);

        } else {

            this.toolbar.classList.remove("dragging");

        }

    }

    snap() {

        const workspace = this.workspace.getBoundingClientRect();

        const toolbar = this.toolbar.getBoundingClientRect();

        const cx = toolbar.left + toolbar.width / 2 - workspace.left;

        const cy = toolbar.top + toolbar.height / 2 - workspace.top;

        const points = {

            "top-left": {

                x: 20,

                y: 20

            },

            "top-right": {

                x: workspace.width - 20,

                y: 20

            },

            "left-middle": {

                x: 20,

                y: workspace.height / 2

            },

            "right-middle": {

                x: workspace.width - 20,

                y: workspace.height / 2

            },

            "bottom-left": {

                x: 20,

                y: workspace.height - 20

            },

            "bottom-right": {

                x: workspace.width - 20,

                y: workspace.height - 20

            }

        };

        let nearest = null;

        let distance = Infinity;

        for (const name in points) {

            const p = points[name];

            const d = Math.hypot(

                cx - p.x,

                cy - p.y

            );

            if (d < distance) {

                distance = d;

                nearest = name;

            }

        }

        this.toolbar.removeAttribute("style");

        this.setDock(nearest);

    }

    setDock(position) {

        const workspace = this.workspace.getBoundingClientRect();

        const toolbar = this.toolbar.getBoundingClientRect();

        let x = 20;
        let y = 20;

        switch (position) {

            case "top-left":

                x = 20;
                y = 20;

                break;

            case "top-right":

                x = workspace.width - toolbar.width - 20;
                y = 20;

                break;

            case "left-middle":

                x = 20;
                y = workspace.height / 2 - toolbar.height / 2;

                break;

            case "right-middle":

                x = workspace.width - toolbar.width - 20;
                y = workspace.height / 2 - toolbar.height / 2;

                break;

            case "bottom-left":

                x = 20;
                y = workspace.height - toolbar.height - 20;

                break;

            case "bottom-right":

                x = workspace.width - toolbar.width - 20;
                y = workspace.height - toolbar.height - 20;

                break;

        }

        this.toolbar.style.left = `${x}px`;
        this.toolbar.style.top = `${y}px`;

        this.currentDock = position;

    }

}