import Renderer from "../canvas/Renderer.js";
import Document from "./document.js";
import ToolManager from "../tools/ToolManager.js";
import SelectionTool from "../tools/SelectionTool.js";
import RectangleTool from "../tools/RectangleTool.js";
import EllipseTool from "../tools/EllipseTool.js";
import EventBus from "./eventBus.js";
import History from "./History.js";
import Viewport from "./Viewport.js";
import Selection from "./Selection.js";
import Transform from "./Transform.js";
import ToolbarManager from "../ui/ToolbarManager.js";
import ThemeManager from "./ThemeManager.js";



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
        this.toolbarManager = null;
        this.themeManager = null;
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

    async initialize(options = {}) {

        console.group("Editor Initialization");

        this.cacheDom();

        this.updateStatus("Loading...");

        // Core
        await this.initializeEventBus();
        await this.initializeDocument(options);
        await this.initializeSelection();
        await this.initializeHistory();
        await this.initializeTransform();
        await this.initializeRenderer();
        await this.initializeViewport();

        // Optional
        // await this.initializeLibrary();
        // await this.initializePanels();

        await this.initializeTools();
        await this.initializeToolbarManager();
        await this.initializeThemeManager();

        this.bindToolbar();
        this.bindEvents();

        // Everything now exists
        this.renderer.render();

        this.initialized = true;

        this.updateStatus("Editor Ready");

        console.log("✔ Editor initialized");

        console.groupEnd();

    }

    async initializeToolbarManager() {

        this.toolbarManager = new ToolbarManager(this);

        this.toolbarManager.initialize();

        console.log("✔ Toolbar Manager");

    }

    async initializeThemeManager() {

        this.themeManager = new ThemeManager(this);

        this.themeManager.initialize();

        console.log("✔ Theme Manager");

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

        this.tools.register(new SelectionTool(this));
        this.tools.register(new RectangleTool(this));
        this.tools.register(new EllipseTool(this));

        this.tools.activate("select");

        this.updateStatus("Tools Ready");

        console.log("✔ Tool Manager");

    }
    async initializeDocument(options = {}) {

        this.document = new Document(this);

        await this.document.initialize(options);

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

        //
        // Key Down
        //

        window.addEventListener("keydown", (e) => {

            const ctrl = e.ctrlKey || e.metaKey;

            //
            // Temporary Selection Tool
            //

            if (e.key === "Control" && !e.repeat) {

                this.tools.activateTemporary("select");

            }

            if (!ctrl) {

                return;

            }

            //
            // Undo / Redo
            //

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

        //
        // Key Up
        //

        window.addEventListener("keyup", (e) => {

            if (e.key === "Control") {

                this.tools.restoreTemporary();

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