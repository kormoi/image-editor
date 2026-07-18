
const TOOL_GROUPS = {

    selection: [
        "select",
        "node"
    ],

    shape: [
        "rectangle",
        "ellipse",
        "line"
    ],

    pen: [
        "pen",
        "point",
        "convert-point"
    ]

};

export default class Toolbar {

    constructor(editor) {

        this.editor = editor;

        this.toolbar = document.getElementById("toolbar");

        this.flyout = document.getElementById("tool-flyout");

        this.bindEvents();

    }

    bindEvents() {

        //
        // Toolbar click
        //

        this.toolbar.addEventListener("mousedown", (e) => {

            const button = e.target.closest(".tool-button");
            if (!button) return;

            // Only left mouse button
            if (e.button !== 0) return;

            const group = button.dataset.group;

            if (!group) return;

            this.holdTimer = setTimeout(() => {

                this.showToolGroup(button, group);

                this.holdTimer = null;

            }, 1000);

        });

        this.toolbar.addEventListener("mouseup", (e) => {

            const button = e.target.closest(".tool-button");
            if (!button) return;

            if (e.button !== 0) return;

            if (this.holdTimer) {

                clearTimeout(this.holdTimer);

                this.holdTimer = null;

                this.activateTool(button.dataset.tool);

            }

        });

        this.toolbar.addEventListener("mouseup", (e) => {

            const button = e.target.closest(".tool-button");
            if (!button) return;

            if (e.button !== 0) return;

            if (this.holdTimer) {

                clearTimeout(this.holdTimer);

                this.holdTimer = null;

                this.activateTool(button.dataset.tool);

            }

        });

        this.toolbar.addEventListener("mouseleave", () => {

            if (this.holdTimer) {

                clearTimeout(this.holdTimer);

                this.holdTimer = null;

            }

        });

        this.toolbar.addEventListener("contextmenu", (e) => {

            e.preventDefault();

            const button = e.target.closest(".tool-button");

            if (!button) return;

            const group = button.dataset.group;

            if (!group) return;

            this.showToolGroup(button, group);

        });

        //
        // Click outside
        //

        document.addEventListener("mousedown", (e) => {

            if (this.flyout.hidden) return;

            if (this.flyout.contains(e.target)) return;

            if (this.toolbar.contains(e.target)) return;

            this.hideGroup();

        });

        //
        // ESC closes flyout
        //

        window.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {

                this.hideGroup();

            }

        });

    }

    showToolGroup(button, group) {

        this.hideGroup();

        this.flyout.innerHTML = "";

        TOOL_GROUPS[group].forEach(tool => {

            const item = document.createElement("button");

            item.className = "tool-item";

            item.title = tool ? tool.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

            item.dataset.tool = tool;

            item.innerHTML = `
            <svg class="tool-icon">
                <use href="assets/icons.svg#icon-${tool}"></use>
            </svg>
        `;

            item.onclick = () => {

                this.activateTool(tool);

                button.dataset.tool = tool;

                button.querySelector("use").setAttribute(
                    "href",
                    `assets/icons.svg#icon-${tool}`
                );

                button.title = tool ? tool.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

                this.hideGroup();

            };

            this.flyout.appendChild(item);

        });

        //
        // Position flyout
        //

        const r = button.getBoundingClientRect();

        this.flyout.style.left = `${r.right + 6}px`;
        this.flyout.style.top = `${r.top}px`;

        this.flyout.hidden = false;

    }

    hideGroup() {

        this.flyout.hidden = true;

        this.flyout.innerHTML = "";

    }

    activateTool(name) {

        this.editor.tools.activate(name);

    }

}