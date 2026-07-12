import Node from "./Node.js";

export default class GraphicObject extends Node {

    constructor(type) {

        super(type);

        this.style = {

            fill: "#000000",

            stroke: "#000000",

            strokeWidth: 1,

            shadow: null

        };

        this.metadata = {};

    }

    serialize() {

        return JSON.parse(JSON.stringify(this));

    }

}