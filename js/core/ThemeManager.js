export default class ThemeManager {

    constructor(editor) {

        this.editor = editor;

        this.theme = "dark";

    }

    initialize() {

        this.set("dark");

    }

    set(theme) {

        this.theme = theme;

        document.documentElement.dataset.theme = theme;

        console.log(

            "Theme:",

            theme

        );

    }

    get() {

        return this.theme;

    }

}