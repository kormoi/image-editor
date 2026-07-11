export default class ToolManager {

    constructor(editor) {

        this.editor = editor;

        this.tools = new Map();

        this.activeTool = null;

    }

    register(tool) {

        this.tools.set(tool.name, tool);

    }

    activate(name) {

        if (this.activeTool) {

            this.activeTool.deactivate();

        }

        const tool = this.tools.get(name);

        if (!tool) {

            console.warn(`Tool '${name}' not found.`);

            return;

        }

        this.activeTool = tool;

        this.activeTool.activate();

        this.editor.eventBus.emit("tool:changed", {

            tool: name

        });

    }

    getActive() {

        return this.activeTool;

    }

}