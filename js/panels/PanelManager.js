export default class PanelManager {

    constructor(editor) {

        this.editor =
            editor;

        this.panels =
            new Map();

        this.sidebar =
            document.getElementById(
                "sidebar"
            );

    }

    register(id, panel) {

        this.panels.set(
            id,
            panel
        );

        if (
            panel.active
        ) {

            this.show(id);

        }

    }

    show(id) {

        const panel =
            this.panels.get(id);

        if (
            !panel
        ) {

            return;

        }

        if (
            !panel.element
        ) {

            panel.createElement();

        }

        if (
            !this.sidebar.contains(
                panel.element
            )
        ) {

            this.sidebar.appendChild(
                panel.element
            );

        }

        panel.show();

        panel.update();

    }

    hide(id) {

        const panel =
            this.panels.get(id);

        if (
            !panel
        ) {

            return;

        }

        panel.hide();

    }

    get(id) {

        return this.panels.get(
            id
        );

    }

    updateAll() {

        this.panels.forEach(
            panel => {

                if (
                    panel.element &&
                    !panel.element.hidden
                ) {

                    panel.update();

                }

            }
        );

    }

}