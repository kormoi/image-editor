import Node from "./Node.js";

export default class ShapeNode extends Node {

    constructor(type) {

        super(type);

        this.fill = "#4F9CFF";

        this.stroke = "#000000";

        this.strokeWidth = 1;

        this.strokeDashArray = [];

        this.cornerRadius = 0;

        this.shadow = null;

    }

}