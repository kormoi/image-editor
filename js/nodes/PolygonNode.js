import GraphicObject from "./GraphicObject.js";

export default class PolygonNode extends GraphicObject {

    constructor() {

        super("polygon");

        this.points = [];

        this.closed = true;

        this.style = {

            fill: "#4A90E2",

            stroke: "#000000",

            strokeWidth: 1

        };

    }

}