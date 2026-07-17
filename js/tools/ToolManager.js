export default class ToolManager {

    constructor(editor) {

        this.editor = editor;

        this.tools = new Map();

        this.activeTool = null;

        this.previousTool = null;

    }

    register(tool) {

        this.tools.set(tool.name, tool);

    }

    activate(name) {

        console.log("Trying to activate:", name);
        console.log("Registered tools:", [...this.tools.keys()]);

        if (this.activeTool) {
            this.activeTool.deactivate();
        }

        const tool = this.tools.get(name);

        console.log("Found tool:", tool);

        if (!tool) {
            console.warn(`Tool '${name}' not found.`);
            return;
        }

        this.activeTool = tool;

        this.activeTool.activate();

        document
            .querySelectorAll("#toolbar button")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.tool === name
                );

            });
        console.log("Activated Tool:", this.activeTool.name);

        this.editor.eventBus.emit("tool:changed", {
            tool: name
        });

    }

    getActive() {

        return this.activeTool;

    }

    activateTemporary(name) {

        if (this.activeTool.name === name) {

            return;

        }

        this.previousTool = this.activeTool;

        this.activate(name);

    }

    restoreTemporary() {

        if (!this.previousTool) {

            return;

        }

        this.activate(this.previousTool.name);

        this.previousTool = null;

    }

}