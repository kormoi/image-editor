import Node from "./Node.js";

export default class ArtboardNode extends Node {

    constructor(options = {}) {

        super("artboard");

        this.name = options.name || "Artboard";

        this.transform.width = options.width ?? 1920;
        this.transform.height = options.height ?? 1080;

        this.transform.x = options.x ?? 0;
        this.transform.y = options.y ?? 0;

        this.background = options.background ?? "#ffffff";

        this.clipContent = true;

        this.locked = false;

    }

}