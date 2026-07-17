export default class SaveManager {

    constructor(editor) {

        this.editor = editor;

        this.dirty = false;

        this.saving = false;

        this.interval = 3000;

        this.timer = null;

    }

    initialize() {

        this.timer = setInterval(() => {

            this.save();

        }, this.interval);

    }

    markDirty() {

        this.dirty = true;

    }

    serialize() {

        return this.editor.project.serialize();

    }

    async save() {

        if (!this.dirty || this.saving) {

            return false;

        }

        this.saving = true;

        const mart = this.serialize();

        this.saving = false;

        this.dirty = false;

        return mart;

    }

    stop() {

        clearInterval(this.timer);

        this.timer = null;

    }

}