import Node from "../nodes/Node.js";
import ArtboardNode from "../nodes/ArtboardNode.js";
import LayerNode from "../nodes/LayerNode.js";

export default class Document {

    constructor(editor) {

        this.editor = editor;

        this.id = crypto.randomUUID();

        this.name = "Untitled Project";

        this.root = null;

        this.activeArtboard = null;

        this.activeLayer = null;

    }

    initialize() {

        // Root Scene Node
        this.root = new Node("root");
        this.root.name = "Document";

        // Default Artboard
        const artboard = new ArtboardNode({

            name: "Artboard 1",

            width: 1920,

            height: 1080,

            background: "#ffffff"

        });

        // Default Layer
        const layer = new LayerNode({

            name: "Layer 1"

        });

        artboard.add(layer);

        this.root.add(artboard);

        this.activeArtboard = artboard;

        this.activeLayer = layer;

        this.editor.eventBus?.emit("document:created", this);

        console.log("✔ Document");

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