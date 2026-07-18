import Panel from "./Panel.js";

export default class PropertyPanel extends Panel {

    constructor(editor, options = {}) {

        super(
            editor,
            options
        );

        this.currentNode =
            null;

    }

    update() {

        const selected =
            this.editor.selection
                .getSelected();

        if (
            selected.length === 0
        ) {

            if (
                this.currentNode !== null
            ) {

                this.currentNode =
                    null;

                this.renderEmpty();

            }

            return;

        }

        if (
            selected.length === 1
        ) {

            const node =
                selected[0];

            if (
                this.currentNode !== node
            ) {

                this.currentNode =
                    node;

                this.renderNode(
                    node
                );

            } else {

                this.refreshValues();

            }

            return;

        }

        this.currentNode =
            null;

        this.renderMultiple(
            selected
        );

    }

    renderEmpty() {

        this.content.innerHTML = `

            <div
                class="property-empty"
            >

                Select an object
                to view its properties.

            </div>

        `;

    }

    renderMultiple(
        nodes
    ) {

        this.content.innerHTML = `

            <div
                class="property-empty"
            >

                ${nodes.length}
                objects selected.

            </div>

        `;

    }

    renderNode(node) {

        const transform =
            node.transform;

        this.content.innerHTML = `

        <div class="property-section">

            <div class="property-section-title">
                Transform
            </div>

            <div class="property-grid">

                ${this.createInput(
            "X",
            "x",
            transform.x
        )}

                ${this.createInput(
            "Y",
            "y",
            transform.y
        )}

                ${this.createInput(
            "Width",
            "width",
            transform.width
        )}

                ${this.createInput(
            "Height",
            "height",
            transform.height
        )}

                ${this.createInput(
            "Rotation",
            "rotation",
            transform.rotation ?? 0
        )}

            </div>

        </div>

    `;

        this.bindInputs();

    }

    createInput(
        label,
        property,
        value
    ) {

        return `

            <label
                class="property-field"
            >

                <span>
                    ${label}
                </span>

                <input
                    type="number"
                    data-property="${property}"
                    value="${Math.round(value ?? 0)}"
                    step="1"
                >

            </label>

        `;

    }

    bindInputs() {

        const inputs =
            this.content.querySelectorAll(
                "[data-property]"
            );

        inputs.forEach(
            input => {

                input.addEventListener(
                    "change",
                    () => {

                        this.changeProperty(
                            input.dataset.property,
                            input.value
                        );

                    }
                );

            }
        );

    }

    changeProperty(
        property,
        value
    ) {

        if (
            !this.currentNode
        ) {

            return;

        }

        const number =
            Math.round(
                Number(value)
            );

        if (
            Number.isNaN(number)
        ) {

            return;

        }

        this.currentNode
            .transform[property] =
            number;

        this.editor.renderer.render();

        this.update();

    }

    refreshValues() {

        if (
            !this.currentNode
        ) {

            return;

        }

        const transform =
            this.currentNode.transform;

        const properties = [
            "x",
            "y",
            "width",
            "height",
            "rotation"
        ];

        properties.forEach(
            property => {

                const input =
                    this.content.querySelector(
                        `[data-property="${property}"]`
                    );

                if (
                    input &&
                    document.activeElement !== input
                ) {

                    input.value =
                        Math.round(
                            transform[property] ?? 0
                        );

                }

            }
        );

    }

}