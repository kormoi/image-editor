import Node from "./Node.js";

export default class ArtboardNode extends Node {

    constructor(options = {}) {

        super("artboard");

        this.name = options.name ?? "Artboard";

        this.transform.width = options.width ?? 1920;
        this.transform.height = options.height ?? 1080;

        this.transform.x = options.x ?? 0;
        this.transform.y = options.y ?? 0;

        this.background = {

            visible: options.background?.visible ?? true,

            type: options.background?.type ?? "solid",

            color: options.background?.color ?? "#ffffff",

            gradient: options.background?.gradient ?? null

        };

        this.clipContent = options.clipContent ?? true;

        this.locked = options.locked ?? false;

    }

}