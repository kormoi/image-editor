import Node from "../nodes/Node.js";
import ArtboardNode from "../nodes/ArtboardNode.js";
import LayerNode from "../nodes/LayerNode.js";
import defaultMart from "../defaults/defaultMart.js";

export default class Document {

    constructor(editor) {

        this.editor = editor;

        this.id = crypto.randomUUID();

        this.name = "Untitled Project";

        this.root = null;

        this.activeArtboard = null;

        this.activeLayer = null;

    }

    initialize(options = {}) {

        // Load .mart or create default
        this.mart = options.mart
            ? structuredClone(options.mart)
            : structuredClone(defaultMart);

        // Override size for new document
        if (!options.mart && options.width && options.height) {

            this.mart.settings.width = options.width;
            this.mart.settings.height = options.height;

            this.mart.artboards[0].width = options.width;
            this.mart.artboards[0].height = options.height;

        }

        // Build the runtime scene graph
        this.root = new Node("root");
        this.root.name = "Document";

        this.activeArtboard = null;
        this.activeLayer = null;

        for (const artboardData of this.mart.artboards) {

            console.log("Artboard data:", artboardData);
            console.log("Layers:", artboardData.layers);

            const artboard = new ArtboardNode(artboardData);

            if (artboardData.layers) {

                for (const layerData of artboardData.layers) {

                    console.log("Creating layer:", layerData);

                    const layer = new LayerNode(layerData);

                    console.log("Layer created:", layer);

                    artboard.add(layer);

                    if (!this.activeLayer) {

                        this.activeLayer = layer;
                        console.log("Active layer assigned:", this.activeLayer);

                    }

                }

            }

            this.root.add(artboard);

            if (!this.activeArtboard) {

                this.activeArtboard = artboard;

            }

        }

        console.log("Final activeLayer:", this.activeLayer);

        this.editor.eventBus?.emit("document:created", this);

        console.log("✔ Document");
    }

    getMart() {

        return this.mart;
        
    }

    getArtboards() {

        return this.mart.artboards;

    }

    getRoot() {

        return this.root;

    }

    getActiveArtboard() {

        return this.activeArtboard;

    }

    setArtboardSize(width, height) {

        const artboard = this.getActiveArtboard();

        if (!artboard) return;

        artboard.transform.width = width;
        artboard.transform.height = height;

        this.editor.renderer.render();

    }

    setArtboardBackground(background) {

        const artboard = this.getActiveArtboard();

        if (!artboard) return;

        artboard.background = structuredClone(background);

        this.editor.renderer.render();

    }

    renameArtboard(name) {

        const artboard = this.getActiveArtboard();

        if (!artboard) return;

        artboard.name = name;

    }

    selectNode(node) {

        this.clearSelection();

        node.selected = true;

        this.selectedNode = node;

    }

    clearSelection() {

        if (this.selectedNode) {

            this.selectedNode.selected = false;

        }

        this.selectedNode = null;

    }

    getActiveLayer() {

        return this.activeLayer;

    }

    setActiveLayer(layer) {

        this.activeLayer = layer;

        this.editor.eventBus?.emit("layer:selected", layer);

    }

    addNode(node, parent = this.activeLayer) {

        parent.add(node);

        this.editor.eventBus?.emit("node:added", node);

        return node;

    }

    removeNode(node) {

        if (!node.parent) {

            return;

        }

        node.parent.remove(node);

        this.editor.eventBus?.emit("node:removed", node);

    }

    traverse(callback) {

        this.root.traverse(callback);

    }

    findNode(id) {

        let result = null;

        this.traverse(node => {

            if (node.id === id) {

                result = node;

            }

        });

        return result;

    }

    findById(id) {

        let result = null;

        this.traverse(node => {

            if (node.id === id) {

                result = node;

            }

        });

        return result;

    }

    clear() {

        this.root.children = [];

        this.activeArtboard = null;

        this.activeLayer = null;

        this.editor.eventBus?.emit("document:cleared");

    }

}