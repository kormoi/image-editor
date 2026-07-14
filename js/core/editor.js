import Renderer from "../canvas/Renderer.js";
import Document from "./document.js";
import ToolManager from "../tools/ToolManager.js";
import SelectionTool from "../tools/SelectionTool.js";
import RectangleTool from "../tools/RectangleTool.js";
import EventBus from "./eventBus.js";
import History from "./History.js";
import Viewport from "./Viewport.js";
import Selection from "./Selection.js";
import Transform from "./Transform.js";




export default class Editor {

    constructor() {

        this.version = "2.0.0";

        this.name = "Editor V2";

        this.initialized = false;

        // Core Modules

        this.renderer = null;
        this.eventBus = null;
        this.document = null;
        this.history = null;
        this.selection = null;
        this.transform = null;
        this.library = null;
        this.commands = null;
        this.tools = null;
        this.clipboard = null;
        this.project = null;
        this.panels = null;
        this.ui = null;
        this.viewport = null;
        this.colors = {

            fill: "#47daff",

            stroke: "#000000",

            strokeWidth: 1

        };

        // DOM References

        this.elements = {};

    }

    async initialize() {

        console.group("Editor Initialization");

        this.cacheDom();

        this.updateStatus("Loading...");

        // These modules will be added one by one
        await this.initializeEventBus();
        await this.initializeDocument();
        await this.initializeSelection();
        await this.initializeHistory();
        await this.initializeTransform();
        await this.initializeRenderer();
        await this.initializeViewport();
        // await this.initializeLibrary();
        // await this.initializePanels();
        await this.initializeTools();
        this.bindToolbar();
        this.bindEvents();

        this.initialized = true;

        this.updateStatus("Editor Ready");

        console.log("✔ Editor initialized");

        console.groupEnd();

    }

    async initializeSelection() {

        this.selection = new Selection(this);

        console.log("✔ Selection");

    }

    async initializeTransform() {

        this.transform = new Transform(this);

        console.log("✔ Transform");

    }

    async initializeTools() {

        this.tools = new ToolManager(this);

        this.tools.register(
            new SelectionTool(this)
        );
        this.tools.register(new RectangleTool(this));
        this.tools.activate("select");

        this.updateStatus("Tools Ready");

        console.log("✔ Tool Manager");

    }
    async initializeDocument() {

        this.document = new Document(this);

        this.document.initialize();

        this.updateStatus("Document Ready");

    }
    async initializeHistory() {

        this.history = new History(this);

        console.log("✔ History");

    }
    async initializeRenderer() {

        this.renderer = new Renderer(this);

        this.renderer.initialize();

        this.updateStatus("Canvas Ready");

    }
    async initializeViewport() {

        this.viewport = new Viewport(this);

        this.viewport.initialize();

        this.viewport.applyBackground();

        this.updateStatus("Viewport Ready");

        console.log("✔ Viewport");

    }
    async initializeEventBus() {

        this.eventBus = new EventBus();

        this.updateStatus("Event Bus Ready");

        console.log("✔ Event Bus");

    }
    bindToolbar() {

        document
            .querySelectorAll("#toolbar button")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const tool = button.dataset.tool;

                    this.tools.activate(tool);

                });

            });

    }
    cacheDom() {

        this.elements.workspace = document.getElementById("workspace");

        this.elements.canvasContainer = document.getElementById("canvas-container");

        this.elements.canvas = document.getElementById("editor-canvas");

        this.elements.statusLeft = document.getElementById("status-left");

        this.elements.statusRight = document.getElementById("status-right");

        this.elements.leftDock = document.getElementById("left-dock");

        this.elements.rightDock = document.getElementById("right-dock");

        this.elements.leftSplitter = document.getElementById("left-splitter");

        this.elements.rightSplitter = document.getElementById("right-splitter");

        this.elements.commandPalette = document.getElementById("command-palette");

        this.elements.commandInput = document.getElementById("command-input");

    }

    bindEvents() {

        window.addEventListener("resize", () => {

            this.onResize();

        });

        window.addEventListener("keydown", (e) => {

            const ctrl = e.ctrlKey || e.metaKey;

            if (!ctrl) {

                return;

            }

            if (e.key.toLowerCase() === "z") {

                e.preventDefault();

                if (e.shiftKey) {

                    this.history.redo();

                } else {

                    this.history.undo();

                }

            } else if (e.key.toLowerCase() === "y") {

                e.preventDefault();

                this.history.redo();

            }

        });

    }

    onResize() {

        if (this.renderer && this.renderer.resize) {

            this.renderer.resize();

        }

    }

    updateStatus(message) {

        if (!this.elements.statusLeft) return;

        this.elements.statusLeft.textContent = message;

    }

}