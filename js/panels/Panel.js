export default class Panel {

    constructor(editor, options = {}) {

        this.editor = editor;

        this.id =
            options.id;

        this.title =
            options.title ??
            this.id;

        this.icon =
            options.icon ??
            null;

        this.collapsible =
            options.collapsible ??
            true;

        this.expanded =
            true;

        this.element =
            null;

        this.content =
            null;

        this.collapseButton =
            null;

    }

    createElement() {

        const panel =
            document.createElement(
                "section"
            );

        panel.className =
            "editor-panel";

        panel.dataset.panel =
            this.id;

        panel.innerHTML = `

            <header
                class="panel-header"
            >

                <div
                    class="panel-title"
                >

                    ${
                        this.icon
                        ? `
                            <svg
                                class="panel-icon"
                            >

                                <use
                                    href="
                                        assets/icons.svg
                                        #icon-${this.icon}
                                    "
                                ></use>

                            </svg>
                        `
                        : ""
                    }

                    <span>
                        ${this.title}
                    </span>

                </div>

                ${
                    this.collapsible
                    ? `
                        <button
                            class="panel-collapse"
                            type="button"
                            aria-label="Collapse panel"
                        >
                            <span>⌃</span>
                        </button>
                    `
                    : ""
                }

            </header>

            <div
                class="panel-content"
            >

            </div>

        `;

        this.element =
            panel;

        this.content =
            panel.querySelector(
                ".panel-content"
            );

        this.collapseButton =
            panel.querySelector(
                ".panel-collapse"
            );

        if (
            this.collapseButton
        ) {

            this.collapseButton.addEventListener(
                "click",
                () => {

                    this.toggle();

                }
            );

        }

        return panel;

    }

    toggle() {

        if (
            !this.collapsible
        ) {

            return;

        }

        this.expanded =
            !this.expanded;

        this.element.classList.toggle(
            "collapsed",
            !this.expanded
        );

    }

    show() {

        if (
            !this.element
        ) {

            this.createElement();

        }

        this.element.hidden =
            false;

    }

    hide() {

        if (
            !this.element
        ) {

            return;

        }

        this.element.hidden =
            true;

    }

    update() {

        // Override in child panels

    }

}