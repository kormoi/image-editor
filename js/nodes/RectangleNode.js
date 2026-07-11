import GraphicObject from "./GraphicObject.js";

export default class RectangleNode extends GraphicObject {

    constructor(options = {}) {

        super("rectangle");

        this.name = options.name ?? "Rectangle";

        this.transform.x = options.x ?? 0;
        this.transform.y = options.y ?? 0;

        this.transform.width = options.width ?? 100;
        this.transform.height = options.height ?? 100;

        this.transform.rotation = options.rotation ?? 0;

        this.fill = options.fill ?? "#4A90E2";

        this.stroke = options.stroke ?? "#000000";

        this.strokeWidth = options.strokeWidth ?? 1;

        this.radius = options.radius ?? 0;

    }

}