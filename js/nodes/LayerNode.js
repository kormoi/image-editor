import Node from "./Node.js";

export default class LayerNode extends Node {

    constructor(options = {}) {

        super("layer");

        this.name = options.name || "Layer";

        this.visible = options.visible ?? true;

        this.locked = options.locked ?? false;

        this.opacity = options.opacity ?? 1;

        this.blendMode = options.blendMode ?? "normal";

    }

}