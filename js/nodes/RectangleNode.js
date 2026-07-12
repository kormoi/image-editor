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

        this.style.fill = options.fill ?? "#ffffff";

        this.style.stroke = options.stroke ?? "#2C6BD9";

        this.style.strokeWidth = options.strokeWidth ?? 1;

        console.log("RectangleNode:", options);
        console.log("Style:", this.style);

        this.radius = options.radius ?? 0;

    }

}